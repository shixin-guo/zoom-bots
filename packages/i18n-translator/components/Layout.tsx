import Link from "next/link";

// import { Github } from "@/components/icons";

interface LayoutProps {
  children: React.ReactNode
}
const Layout = ({
  children
}: LayoutProps): JSX.Element => {
  return (
    <div>
      <nav className="mt-3 ml-3 font-bold text-xl mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-5">
          🏠 Home
        </Link>
        <Link href="/convert" className="mr-5">
          🚢 Convert
        </Link>
        <Link href="/md" className="mr-5">
          🚧 Markdown Translator
        </Link>
        <Link href="/csv" className="mr-5">
          🚧 CSV Loader
        </Link>
      </nav>
      {children}
    </div>
  );
};
export default Layout;