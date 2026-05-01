import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Email là bắt buộc').email('Email không đúng định dạng'),
});
