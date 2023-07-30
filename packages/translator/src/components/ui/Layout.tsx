import { siteConfig } from '@/config/site';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div>
      <nav
        className="max-w-container mx-auto ml-3
        mt-3 flex items-center justify-between
        px-4 pb-3 text-base  font-medium leading-7 text-slate-900 sm:px-6 lg:px-8
        "
      >
        <div className="">{siteConfig.name}</div>
        <div className="flex items-center">{/* <User /> */}</div>
      </nav>
      {children}
    </div>
  );
};
export default Layout;
