"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import ToasterProvider from "./components/ui/ToasterProvider";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
      <ToasterProvider />
      {children}
    </SessionProvider>
  );
}
