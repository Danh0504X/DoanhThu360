import { z } from 'zod';

const phoneRegex = /^(?:\+84|84|0)(?:\d[\s.-]?){8,10}$/;

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, 'Vui lòng nhập họ tên'),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || phoneRegex.test(value), 'Số điện thoại không hợp lệ'),
  email: z.email('Email không hợp lệ'),
  birthDate: z.string().optional().or(z.literal('')),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    path: ['newPassword'],
    message: 'Mật khẩu mới không được giống mật khẩu hiện tại',
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    path: ['confirmPassword'],
    message: 'Xác nhận mật khẩu không khớp',
  });
