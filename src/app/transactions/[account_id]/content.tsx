'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, EllipsisVerticalIcon, PlusIcon } from 'lucide-react';
import { format, getDaysInMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Image } from '@/components/atoms/Image';
import { Transaction } from '@/interfaces/transaction';
import DrawerTransaction from '@/app/transactions/[account_id]/DrawerTransaction';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '@/providers/GlobalProvider';
import { cn } from '@/lib/utils';

type Props = {
  account_id: string;
};

export default function Content(props: Props) {
  const router = useRouter();

  const { state } = useGlobalState();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [transactionSelected, setTransactionSelected] = useState<{ mode: 'create' | 'edit'; data: Transaction }>({
    mode: 'create',
    data: {} as Transaction,
  });

  const [currentDate, setCurrentDate] = useState(new Date());

  const days = getDaysInMonth(currentDate.getMonth());

  const { account_id } = props;
  const account = state.accounts.find((obj) => obj._id == account_id)!;

  const transactions = account ? account.transactions?.filter((transaction) => new Date(transaction.date).getMonth() === currentDate.getMonth()) : [];
  const totalMonth = transactions.reduce((acc, transaction) => {
    return (acc += transaction.transactionType === 'Despesa' ? -Number(transaction.value) : Number(transaction.value));
  }, 0);

  return (
    <div className="h-full flex flex-col text-base">
      <DrawerTransaction open={openDrawer} setOpen={setOpenDrawer} data={transactionSelected!} account_id={account_id} />

      <header className="pt-3 pb-1 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.replace('/')}>
          <ArrowLeftIcon />
        </Button>

        <h1 className="font-bold">Todos os lançamentos</h1>

        <Button variant="ghost">
          <EllipsisVerticalIcon />
        </Button>
      </header>

      <section className="w-full bg-muted flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            setCurrentDate((old) => {
              const newDate = new Date(old); // Criar uma nova instância da data
              newDate.setMonth(newDate.getMonth() - 1); // Incrementar o mês
              return newDate; // Retornar a nova data para atualizar o estado
            });
          }}
        >
          <ArrowLeftIcon size={23} />
        </Button>

        {currentDate.getFullYear() === new Date().getFullYear() ? (
          <span className="capitalize">{format(currentDate, 'MMMM', { locale: ptBR })}</span>
        ) : (
          <span className="capitalize">{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</span>
        )}

        <Button
          variant="ghost"
          onClick={() => {
            setCurrentDate((old) => {
              const newDate = new Date(old); // Criar uma nova instância da data
              newDate.setMonth(newDate.getMonth() + 1); // Incrementar o mês
              return newDate; // Retornar a nova data para atualizar o estado
            });
          }}
        >
          <ArrowRightIcon size={23} />
        </Button>
      </section>

      <section className="w-full pt-2 px-3 flex-1">
        <div className="flex flex-col gap-3">
          {Array.from({ length: days }).map((u, index) => {
            const day = index + 1;

            const condition = (transaction: any) => new Date(transaction.date).getDate() === day;
            if (!transactions.some(condition)) return null;

            return transactions.filter(condition).map((transaction, tIndex) => {
              return (
                <div key={transaction._id}>
                  {tIndex === 0 ? (
                    <span className="mb-3 block">
                      {day} de {format(currentDate, 'MMMM', { locale: ptBR })}
                    </span>
                  ) : null}

                  <div
                    key={account._id}
                    className="flex items-stretch justify-between"
                    onClick={() => {
                      setOpenDrawer(true);
                      setTransactionSelected({ mode: 'edit', data: transaction });
                    }}
                  >
                    <figure className="flex items-center gap-3">
                      <Image src={transaction.uri} name={transaction.name} className="w-9 h-9 text-base pt-0.5" />

                      <figcaption className="flex flex-col">
                        <span>{transaction.name}</span>
                        <small>{transaction.transactionType}</small>
                      </figcaption>
                    </figure>

                    <div className="flex flex-col absolute bottom-0 right-0 text-end">
                      <strong className={cn(transaction.transactionType === 'Despesa' ? 'text-rose-500' : 'text-teal-500')}>
                        {Number(transaction.value).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                      </strong>
                      <small>{transaction.status ? 'Pago' : 'Não pago'}</small>
                    </div>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </section>

      <footer>
        <section className="w-full px-3 pt-2 pb-8 border-y border">
          <div
            data-positive={totalMonth >= 0}
            className="flex items-center justify-between gap-2 text-[15px] font-medium data-[positive=true]:text-teal-500 text-rose-500"
          >
            <div className="flex items-center gap-2">
              <span>Total</span>
              <span>{totalMonth.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
            </div>

            <Button
              className="w-10 h-10"
              onClick={() => {
                setOpenDrawer(true);
                setTransactionSelected({ mode: 'create', data: {} as Transaction });
              }}
            >
              <PlusIcon />
            </Button>
          </div>
        </section>
      </footer>
    </div>
  );
}
