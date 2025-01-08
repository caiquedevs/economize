import { Transaction } from '@/interfaces/transaction';

export interface Account {
  _id: string;
  name: string;
  uri: string;
  ballance: string;
  transactions: Transaction[];
}
