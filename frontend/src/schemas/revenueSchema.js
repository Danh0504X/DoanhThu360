import { z } from 'zod';

const coerceMoney = (fieldLabel) =>
  z.coerce
    .number({
      invalid_type_error: `${fieldLabel} phải là số hợp lệ`,
    })
    .min(0, 'Số tiền không được âm');

export const revenueSchema = z.object({
  businessId: z.string().min(1, 'Vui lòng chọn hộ kinh doanh'),
  date: z.string().min(1, 'Vui lòng chọn ngày ghi nhận'),
  code: z.string().optional(),
  content: z.string().trim().min(1, 'Vui lòng nhập nội dung doanh thu'),
  cashAmount: coerceMoney('Tiền mặt'),
  bankAmount: coerceMoney('Tiền tài khoản'),
  note: z.string().optional(),
}).refine(
  (data) => Number(data.cashAmount || 0) + Number(data.bankAmount || 0) > 0,
  {
    path: ['cashAmount'],
    message: 'Tổng doanh thu phải lớn hơn 0',
  },
);
