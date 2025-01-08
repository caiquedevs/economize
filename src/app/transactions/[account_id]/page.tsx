import React from 'react';
import Content from '@/app/transactions/[account_id]/content';

export default async function Page(props: any) {
  const { account_id } = await props.params;
  return <Content account_id={account_id} />;
}
