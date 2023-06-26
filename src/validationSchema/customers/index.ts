import * as yup from 'yup';

export const customerValidationSchema = yup.object().shape({
  credit_amount: yup.number().integer().required(),
  debit_loan: yup.number().integer().required(),
  due_date_emi: yup.date().required(),
  bank_id: yup.string().nullable(),
});
