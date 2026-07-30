import { z } from 'zod';

const phoneRegex = /^(?:\+84|84|0)(?:\d[\s.-]?){8,10}$/;
// Vietnamese tax code: 10 digits, optionally followed by a 3-digit branch suffix.
const taxCodeRegex = /^\d{10}(-\d{3})?$/;

export const businessSchema = z.object({
  name: z.string().trim().min(2, 'Tên hộ kinh doanh phải có ít nhất 2 ký tự'),
  taxCode: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập mã số thuế')
    .refine((value) => taxCodeRegex.test(value), 'Mã số thuế gồm 10 chữ số (VD: 0312345678, hoặc 0312345678-001)'),
  address: z.string().trim().min(5, 'Vui lòng nhập địa chỉ đầy đủ hơn (tối thiểu 5 ký tự)'),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || phoneRegex.test(value), 'Số điện thoại không hợp lệ'),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || z.email().safeParse(value).success, 'Email không hợp lệ'),
  status: z.enum(['active', 'inactive']).default('active'),
  note: z.string().trim().optional().or(z.literal('')),
});

export const BUSINESS_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
];
