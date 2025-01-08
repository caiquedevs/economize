export interface Transaction {
  _id: string;
  uri: string;
  name: string;
  transactionType: 'Despesa' | 'Renda';
  value: string;
  status: boolean;
  date: Date;
}
