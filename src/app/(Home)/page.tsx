'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Image } from '@/components/atoms/Image';
import { Button } from '@/components/ui/button';
import { accounts } from '@/constants';
import Link from 'next/link';
import DrawerAccount from '@/app/transactions/[account_id]/DrawerAccount';
import { Account } from '@/interfaces/account';
import { useGlobalState } from '@/providers/GlobalProvider';
import { useRouter } from 'next/navigation';

export default function Page() {
  const globalState = useGlobalState();

  const router = useRouter();

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [accountSelected, setAccountSelected] = React.useState<{ mode: 'create' | 'edit'; data: Account }>({
    mode: 'create',
    data: {} as Account,
  });

  const [isHolding, setIsHolding] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleHoldStart = (event: React.MouseEvent | React.TouchEvent, account: Account) => {
    event.preventDefault();
    setIsHolding(true);

    timerRef.current = setTimeout(() => {
      setOpenDrawer(true);
      setAccountSelected({ mode: 'edit', data: account });
    }, 500);
  };

  const handleHoldEnd = (event: React.MouseEvent | React.TouchEvent) => {
    setIsHolding(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <main className="p-5">
      <DrawerAccount open={openDrawer} setOpen={setOpenDrawer} data={accountSelected!} />

      <Card>
        <CardHeader>
          <span>Minhas contas</span>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            {globalState.state.accounts.map((account) => (
              <div
                key={account._id}
                onMouseDown={(e) => handleHoldStart(e, account)}
                onMouseUp={handleHoldEnd}
                onMouseLeave={handleHoldEnd}
                onTouchStart={(e) => handleHoldStart(e, account)}
                onTouchEnd={handleHoldEnd}
                onClick={(e) => {
                  if (isHolding) {
                    e.preventDefault();
                    return;
                  }

                  console.log('Clique simples detectado!');
                  router.replace(`/transactions/${account._id}`);
                }}
              >
                <div className="flex items-stretch justify-between">
                  <figure className="flex items-center gap-3">
                    <Image src={account.uri} name={account.name} />
                    <figcaption className="flex flex-col">
                      <span>{account.name}</span>
                      <small>Conta manual</small>
                    </figcaption>
                  </figure>

                  <strong className="block absolute bottom-0 right-0">
                    {Number(account.ballance).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setOpenDrawer(true);
              setAccountSelected({ mode: 'create', data: {} as Account });
            }}
          >
            Criar conta
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
