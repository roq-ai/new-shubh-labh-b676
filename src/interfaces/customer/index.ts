import { BankInterface } from 'interfaces/bank';
import { GetQueryInterface } from 'interfaces';

export interface CustomerInterface {
  id?: string;
  credit_amount: number;
  debit_loan: number;
  due_date_emi: any;
  bank_id?: string;
  created_at?: any;
  updated_at?: any;

  bank?: BankInterface;
  _count?: {};
}

export interface CustomerGetQueryInterface extends GetQueryInterface {
  id?: string;
  bank_id?: string;
}
