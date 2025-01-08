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
import { Account } from '@/interfaces/account';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: { mode: 'create' | 'edit'; data: Account };
};

const initialState: Account = {
  _id: '',
  name: '',
  uri: '',
  ballance: '0',
  transactions: [],
};

export default function DrawerTransaction(props: Props) {
  const [date, setDate] = React.useState<Date>();
  const [fields, setFields] = React.useState(initialState);

  const globalState = useGlobalState();

  const setValue = (field: keyof typeof initialState, value: any) => setFields((old) => ({ ...old, [field]: value }));

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    globalState.setState((old) => {
      const copy = structuredClone(old);

      if (props.data.mode === 'create') {
        copy.accounts.push({ ...fields, _id: crypto.randomUUID() });
      }

      if (props.data.mode === 'edit') {
        const obj = copy.accounts.find((obj) => obj._id === props.data.data._id);

        if (obj) {
          obj.name = fields.name;
          obj.uri = fields.uri;
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
        <SheetHeader className="!px-0">
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit}>
          <div className="px-6">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nome</Label>
                <Input placeholder="Nome da conta" className="col-span-3" value={fields.name} onChange={(e) => setValue('name', e.target.value)} />
              </div>
            </div>

            <SheetFooter className="flex-row gap-3">
              <ShowIf show={props.data.mode === 'edit'}>
                <Button
                  type="button"
                  onClick={() => {
                    globalState.setState((old) => {
                      const copy = structuredClone(old);

                      if (copy.accounts) copy.accounts = copy.accounts.filter((obj) => obj._id !== props.data.data._id);

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
