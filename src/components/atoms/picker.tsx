'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ptBR } from 'date-fns/locale';

type Props = {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export function DatePicker(props: Props) {
  const date = props.date;

  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button ref={btnRef} variant={'outline'} className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP', { locale: ptBR }) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {/* <Calendar mode="single" locale={ptBR} selected={date} onSelect={props.setDate} initialFocus /> */}
        <Calendar
          mode="single"
          selected={props.date}
          onSelect={(value) => {
            props.setDate(value || props.date);
            btnRef.current?.click();
          }}
          locale={ptBR}
          defaultMonth={props.date ? new Date(props.date) : new Date()}
          showOutsideDays={false}
        />
      </PopoverContent>
    </Popover>
  );
}
