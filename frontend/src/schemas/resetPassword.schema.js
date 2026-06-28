import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Email là bắt buộc').email('Email không đúng định dạng'),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Mã đặt lại gồm 6 chữ số'),
  password: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Xác nhận mật khẩu phải trùng mật khẩu mới',
});
