import crypto from 'crypto';

export const hashToken = (token) =>
  crypto.createHash('sha256').update(String(token)).digest('hex');
