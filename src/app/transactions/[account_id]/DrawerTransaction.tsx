import { Drawer } from '@/components/atoms/drawer';
import { Transaction } from '@/interfaces/transaction';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/atoms/picker';
import { TrashIcon } from 'lucide-react';
import { ShowIf } from '@/components/atoms/showIf';
import { useGlobalState } from '@/providers/GlobalProvider';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: { mode: 'create' | 'edit'; data: Transaction };
  account_id: string;
};

const initialState: Transaction = {
  _id: '',
  uri: '',
  name: '',
  transactionType: 'Despesa',
  value: '',
  status: false,
  date: new Date(),
};

export default function DrawerAccount(props: Props) {
  const [fields, setFields] = React.useState(initialState);

  const globalState = useGlobalState();

  const setValue = (field: keyof typeof initialState, value: any) => setFields((old) => ({ ...old, [field]: value }));

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(fields);

    globalState.setState((old) => {
      const copy = structuredClone(old);
      const currentAccount = copy.accounts.find((obj) => obj._id === props.account_id);

      if (props.data.mode === 'create') {
        currentAccount?.transactions.push({ ...fields, _id: crypto.randomUUID() });
      }

      if (props.data.mode === 'edit') {
        const obj = currentAccount?.transactions.find((obj) => obj._id === props.data.data._id);
        if (obj) {
          obj.date = fields.date;
          obj.name = fields.name;
          obj.status = fields.status;
          obj.transactionType = fields.transactionType;
          obj.uri = fields.uri;
          obj.value = fields.value;
        }
      }

      return copy;
    });

    props.setOpen(false);
  };

  React.useEffect(() => {
    setFields(props.data.mode === 'edit' ? props.data.data : initialState);

    return () => {};
  }, [props.data]);

  return (
    <Drawer open={props.open} setOpen={props.setOpen}>
      <SheetContent side="bottom" className="pt-0 px-0">
        <form onSubmit={onSubmit}>
          <SheetHeader className="!px-0">
            <SheetTitle>
              <Input
                value={fields.value}
                placeholder="00,00"
                className="w-full h-24 border-0 border-b text-right text-3xl font-bold placeholder:text-3xl"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').replace(/^(\d+)(\d{2})$/, '$1.$2');
                  setValue('value', value);
                }}
              />
            </SheetTitle>
          </SheetHeader>

          <div className="px-6">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nome</Label>
                <Input
                  placeholder="Nome da transação"
                  className="col-span-3"
                  value={fields.name}
                  onChange={(e) => setValue('name', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tipo
                </Label>
                <Select value={fields.transactionType} onValueChange={(value) => setValue('transactionType', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Despesa">Despesa</SelectItem>
                      <SelectItem value="Renda">Renda</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Data
                </Label>

                <div className="col-span-3">
                  <DatePicker date={fields.date} setDate={(value) => setValue('date', value)} />
                </div>
              </div>
            </div>

            <SheetFooter className="flex-row gap-3">
              <ShowIf show={props.data.mode === 'edit'}>
                <Button
                  type="button"
                  onClick={() => {
                    globalState.setState((old) => {
                      const copy = structuredClone(old);
                      const currentAccount = copy.accounts.find((obj) => obj._id === props.account_id);

                      if (currentAccount) {
                        currentAccount.transactions = currentAccount?.transactions.filter((obj) => obj._id !== props.data.data._id) || [];
                      }

                      return copy;
                    });

                    props.setOpen(false);
                  }}
                  variant="outline"
                  className="border-rose-500/50 text-rose-500/50"
                >
                  <TrashIcon />
                </Button>
              </ShowIf>

              <Button type="submit" className="flex-1">
                Salvar
              </Button>
            </SheetFooter>
          </div>
        </form>
      </SheetContent>
    </Drawer>
  );
}
