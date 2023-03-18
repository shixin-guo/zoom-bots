import React, { FC, ReactNode } from "react";
interface BaseLayoutProps {
  children?: ReactNode
}
const Layout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};
export default Layout;