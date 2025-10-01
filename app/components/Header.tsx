import Link from "next/link";
import { ShieldCheck } from "lucide-react"; // You'll need to install lucide-react

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">
              Tourist Safety Portal
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/register"
              className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md"
            >
              Register Tourist
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md"
            >
              Dashboard
            </Link>
            <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Login
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
