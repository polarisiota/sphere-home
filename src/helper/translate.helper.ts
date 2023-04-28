import { Invoice } from '@prisma/client';

export const getReturnableInvoice = (invoice: Invoice) => {
  return {
    id: invoice.id,
    amount: Number(invoice.amount),
    status: invoice.status,
    payerId: invoice.payerId,
    receiverId: invoice.receiverId,
    createdAt: invoice.createdAt,
  };
};
