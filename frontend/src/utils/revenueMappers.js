/**
 * Maps the revenue form values to the API payload shape used by
 * create/update revenue endpoints.
 */
export const mapRevenueFormToPayload = (values) => ({
  businessId: values.businessId,
  revenueDate: values.date,
  content: values.content,
  cashAmount: Number(values.cashAmount || 0),
  bankAmount: Number(values.bankAmount || 0),
  note: values.note || '',
});
