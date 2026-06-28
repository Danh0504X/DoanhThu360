import { api } from '../lib/api.js';

const REPORTS_URL = '/reports';

const parseFileName = (contentDisposition) => {
  if (!contentDisposition) return null;

  const match = contentDisposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] || null;
};

const parseBlobError = async (error) => {
  const responseData = error.response?.data;

  if (responseData instanceof Blob) {
    try {
      const text = await responseData.text();
      const json = JSON.parse(text);
      return json?.message || 'Không thể xuất file Word';
    } catch {
      return 'Không thể xuất file Word';
    }
  }

  return error.response?.data?.message || error.message || 'Không thể xuất file Word';
};

export const exportReportService = {
  async exportRevenueWord(params) {
    try {
      // Goes through `api`, so the access token is attached and 401s trigger a refresh + retry.
      const response = await api.get(`${REPORTS_URL}/revenue-word`, {
        params,
        responseType: 'blob',
      });

      return {
        blob: response.data,
        fileName: parseFileName(response.headers['content-disposition']) || 'so-doanh-thu.docx',
      };
    } catch (error) {
      const normalizedError = new Error(await parseBlobError(error));
      normalizedError.status = error.response?.status;
      throw normalizedError;
    }
  },
};
