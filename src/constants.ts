// Obter a data atual

// Subtrair 10 dias

const generateDate = (n: number) => {
  const dateNow = new Date();

  dateNow.setDate(dateNow.getDate() + n);

  return dateNow;
};

export const accounts = [
  {
    _id: '102003',
    name: 'Caique',
    uri: '',
    ballance: -2661,
    transactions: [
      {
        _id: '123',
        uri: '',
        name: 'Cheque especial',
        transactionType: 'Despesa',
        value: '-2785',
        status: true,
        date: generateDate(-4),
      },
      {
        _id: '1234',
        uri: '',
        name: 'IPTU CDHU',
        transactionType: 'Despesa',
        value: '-305',
        status: true,
        date: generateDate(-4),
      },
      {
        _id: '12345',
        uri: '',
        name: 'Cartão magazine',
        transactionType: 'Despesa',
        value: '-4999',
        status: false,
        date: generateDate(10),
      },
    ],
  },
  { _id: '20230010001', name: 'Loja', uri: '', ballance: 0, transactions: [] },
];
