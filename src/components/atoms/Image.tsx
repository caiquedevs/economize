import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  name: string;
  src: string;
  className?: string;
  classNameFb?: string;
};

export function Image(props: Props) {
  return (
    <Avatar>
      <AvatarImage src={props.src} className={props.className} />
      <AvatarFallback className={props.className}>{props.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
