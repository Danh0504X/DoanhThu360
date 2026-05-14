import { z } from 'zod';

const phoneRegex = /^(?:\+84|84|0)(?:\d[\s.-]?){8,10}$/;

export const businessSchema = z.object({
  name: z.string().trim().min(1, 'Vui lòng nhập tên hộ kinh doanh'),
  taxCode: z.string().trim().min(1, 'Vui lòng nhập mã số thuế'),
  businessType: z.string().trim().min(1, 'Vui lòng chọn loại hình kinh doanh'),
  address: z.string().trim().min(1, 'Vui lòng nhập địa chỉ'),
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
  status: z.enum(['active', 'inactive']),
  note: z.string().trim().optional().or(z.literal('')),
});

export const BUSINESS_TYPE_OPTIONS = [
  { value: 'retail', label: 'Bán lẻ' },
  { value: 'food_service', label: 'Dịch vụ ăn uống' },
  { value: 'beauty_service', label: 'Dịch vụ làm đẹp' },
  { value: 'construction_materials', label: 'Vật liệu xây dựng' },
  { value: 'other', label: 'Khác' },
];

export const BUSINESS_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
];
