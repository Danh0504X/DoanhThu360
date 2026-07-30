// Classifies a revenue row by how it was paid, for badges/labels across the app.
export const getPaymentType = (row) => {
  const hasCash = Number(row.cashAmount || 0) > 0;
  const hasBank = Number(row.bankAmount || 0) > 0;

  if (hasCash && hasBank) return 'HỖN HỢP';
  if (hasCash) return 'TIỀN MẶT';
  if (hasBank) return 'TÀI KHOẢN';
  return '--';
};
