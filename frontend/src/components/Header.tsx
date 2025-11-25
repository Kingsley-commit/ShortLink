import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Menu } from "lucide-react";
import Logo from "../assets/Link.svg";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-md"
    >
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center relative">
        <Link to="/home">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="w-6 h-6 mr-2" />
            <h1 className="text-[18px] font-bold text-[#012945]">ShortLink</h1>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
         

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="hidden md:flex items-center space-x-2 px-4 py-2 bg-[#002395] text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>

         
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        
        {menuOpen && (
          <div className="absolute right-4 top-full mt-2 bg-white shadow-lg rounded-lg p-4 w-48 flex flex-col items-start z-10 md:hidden">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">
                Welcome, {user?.name.split(" ")[0]}!
              </span>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-2 px-4 py-2 bg-[#002395] text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-2" />
              <span className="text-[18px]">Logout</span>
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
