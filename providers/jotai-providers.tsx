'use client';

import { Provider } from 'jotai';
import React from 'react';

export function JotaiProviders({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return <Provider>{children}</Provider>;
}
