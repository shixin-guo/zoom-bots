import Link from "next/link";

import { Logo } from "@/components/icons";

interface LayoutProps {
  children: React.ReactNode
}
const Layout = ({
  children
}: LayoutProps): JSX.Element => {
  return (
    <div>
      <nav className="flex justify-between items-center
        font-medium text-base leading-7 text-slate-900
        mt-3 pb-3 ml-3  mx-auto max-w-container px-4 sm:px-6 lg:px-8
        "
      >
        <div className="">
          <Logo width={"36px"} height={"36px"} className="inline"/> Translator
        </div>
        <div className="">
          <Link href="/" className="mr-5">
          🏠 Wordings Properties
          </Link>
          <Link href="/md" className="mr-5">
          📝 Markdown File
          </Link>
          <Link href="/convert" className="mr-5">
          🚢 Convert
          </Link>
          {/* <Link href="/csv" className="mr-5">
            🚧 CSV Loader (in progress)
          </Link> */}
        </div>
      </nav>
      {children}
    </div>
  );
};
export default Layout;