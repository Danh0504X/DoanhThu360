import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Họ và tên là bắt buộc'),
  email: z.string().trim().min(1, 'Email là bắt buộc').email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Xác nhận mật khẩu phải trùng mật khẩu',
});
