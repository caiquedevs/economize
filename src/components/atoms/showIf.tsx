import React, { HTMLAttributes, ElementType } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: React.ReactNode;
  show: boolean | string | number | File | undefined | null;
}

export function ShowIf({ as: Component = React.Fragment, show, children, ...props }: Props) {
  if (!show) return null;

  return <Component {...props}>{children}</Component>;
}
