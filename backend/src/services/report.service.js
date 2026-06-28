import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { createError } from '../utils/errors.js';
import { ensureBusinessOwnership } from './business.service.js';
import { getRevenueWordRows } from '../repositories/revenue.repository.js';
import { toVietnamDateBoundary } from '../utils/timezone.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_PATH = path.resolve(__dirname, '../../templates/mau_so_doanh_thu_ban_hang.docx');
const PAGE_BREAK_XML = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
const TEMPLATE_ISSUE_DATE = '31/12/2025';

let templateBufferPromise;

const getTemplateBuffer = async () => {
  if (!templateBufferPromise) {
    templateBufferPromise = readFile(TEMPLATE_PATH);
  }

  return templateBufferPromise;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value, options = {}) =>
  new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    ...options,
  }).format(new Date(value));

const formatDisplayDateRange = (from, to) => ({
  fromDate: formatDate(from),
  toDate: formatDate(to),
});

const getMonthRange = (value) => {
  const [year, month] = value.split('-').map(Number);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return {
    from: `${value}-01`,
    to: `${value}-${String(lastDay).padStart(2, '0')}`,
  };
};

const getYearMonthValues = (year) =>
  Array.from({ length: 12 }, (_, index) => `${year}-${String(index + 1).padStart(2, '0')}`);

const buildMonthLabel = (monthValue) => {
  const [year, month] = monthValue.split('-');
  return `Tháng ${month}/${year}`;
};

const buildRowDescription = (date, entryCount) => {
  const formattedDate = formatDate(`${date}T00:00:00.000Z`);
  if (entryCount > 1) {
    return `Doanh thu bán hàng hóa, dịch vụ trong ngày ${formattedDate}`;
  }

  return `Doanh thu bán hàng hóa, dịch vụ ngày ${formattedDate}`;
};

const mapRowsForTemplate = (rows = []) =>
  rows.map((row, index) => {
    const noteText = row.notes?.join('; ') || '';
    // "Diễn giải" uses the note only when the day has a single record with a note.
    // If several records fall on the same day (trùng) or there's no note,
    // use the default description sentence instead.
    const useNote = row.entryCount === 1 && Boolean(noteText);

    return {
      voucher_no: String(index + 1),
      date: formatDate(`${row.date}T00:00:00.000Z`),
      description: useNote ? noteText : buildRowDescription(row.date, row.entryCount),
      cash: formatCurrency(row.totalCash),
      bank: formatCurrency(row.totalBank),
      total: formatCurrency(row.totalRevenue),
      note: noteText,
    };
  });

const buildTemplateData = ({ business, rows, from, to, sectionTitle }) => {
  const mappedRows = mapRowsForTemplate(rows);
  const totals = rows.reduce((accumulator, row) => ({
    totalCash: accumulator.totalCash + Number(row.totalCash || 0),
    totalBank: accumulator.totalBank + Number(row.totalBank || 0),
    totalRevenue: accumulator.totalRevenue + Number(row.totalRevenue || 0),
  }), {
    totalCash: 0,
    totalBank: 0,
    totalRevenue: 0,
  });

  const { fromDate, toDate } = formatDisplayDateRange(from, to);

  return {
    business_name: business.businessName,
    tax_code: business.taxCode || '',
    address: business.address || '',
    business_location: business.address || '',
    issue_date: TEMPLATE_ISSUE_DATE,
    from_date: fromDate,
    to_date: toDate,
    rows: mappedRows,
    total_cash: formatCurrency(totals.totalCash),
    total_bank: formatCurrency(totals.totalBank),
    grand_total: formatCurrency(totals.totalRevenue),
    note: sectionTitle || '',
  };
};

const renderTemplate = async (data) => {
  const templateBuffer = await getTemplateBuffer();

  try {
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '{{',
        end: '}}',
      },
    });

    doc.render(data);

    return doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
  } catch (error) {
    throw createError(`Template Word lỗi: ${error.message}`, 500);
  }
};

const parseDocumentXml = (xml) => {
  // Use [\s\S] (not `.`) so the prefix can span the newline that Word puts
  // between the XML prolog and <w:document>; `.` would stop at that newline.
  const match = xml.match(/^([\s\S]*?<w:body>)([\s\S]*?)(<w:sectPr[\s\S]*?<\/w:sectPr>)<\/w:body><\/w:document>\s*$/);

  if (!match) {
    throw createError('Không thể đọc nội dung template Word', 500);
  }

  return {
    prefix: match[1],
    bodyContent: match[2],
    sectPr: match[3],
  };
};

const extractRenderedDocumentXml = (buffer) => {
  const zip = new PizZip(buffer);
  return zip.file('word/document.xml')?.asText();
};

const buildAnnualBuffer = async (sections) => {
  const renderedBuffers = await Promise.all(sections.map((section) => renderTemplate(section)));
  const renderedXmls = renderedBuffers.map(extractRenderedDocumentXml);
  const parsedXmls = renderedXmls.map(parseDocumentXml);
  const { prefix, sectPr } = parsedXmls[0];

  const bodyContent = parsedXmls
    .map((parsedXml, index) => (index === 0 ? parsedXml.bodyContent : `${PAGE_BREAK_XML}${parsedXml.bodyContent}`))
    .join('');

  const templateBuffer = await getTemplateBuffer();
  const zip = new PizZip(templateBuffer);
  zip.file('word/document.xml', `${prefix}${bodyContent}${sectPr}</w:body></w:document>`);

  return zip.generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });
};

const getMonthSectionData = async ({ userId, business, monthValue }) => {
  const range = getMonthRange(monthValue);
  const from = toVietnamDateBoundary(range.from, 'start');
  const to = toVietnamDateBoundary(range.to, 'end');
  const rows = await getRevenueWordRows({
    userId,
    businessId: business._id,
    from,
    to,
  });

  return {
    rows,
    templateData: buildTemplateData({
      business,
      rows,
      from,
      to,
      sectionTitle: buildMonthLabel(monthValue),
    }),
  };
};

const sanitizeFileNamePart = (value) =>
  String(value || 'report')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

export const exportRevenueWord = async ({ userId, businessId, periodType, value }) => {
  const business = await ensureBusinessOwnership(userId, businessId);

  if (periodType === 'month') {
    const { rows, templateData } = await getMonthSectionData({
      userId,
      business,
      monthValue: value,
    });

    if (!rows.length) {
      throw createError('Không có dữ liệu doanh thu trong kỳ đã chọn', 404);
    }

    return {
      buffer: await renderTemplate(templateData),
      fileName: `so-doanh-thu-${sanitizeFileNamePart(business.businessName)}-${value}.docx`,
    };
  }

  const monthValues = getYearMonthValues(value);
  const sectionResults = await Promise.all(
    monthValues.map((monthValue) => getMonthSectionData({
      userId,
      business,
      monthValue,
    })),
  );

  const hasAnyData = sectionResults.some((section) => section.rows.length > 0);
  if (!hasAnyData) {
    throw createError('Không có dữ liệu doanh thu trong năm đã chọn', 404);
  }

  return {
    buffer: await buildAnnualBuffer(sectionResults.map((section) => section.templateData)),
    fileName: `so-doanh-thu-${sanitizeFileNamePart(business.businessName)}-${value}.docx`,
  };
};
