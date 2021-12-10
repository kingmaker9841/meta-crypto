import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const BaseLayout = ({ children }: Props) => {
  return (
    <main className="relative bg-gray-900 w-screen h-screen">{children}</main>
  );
};

export default BaseLayout;
