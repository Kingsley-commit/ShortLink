import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";
import Logo from "../assets/Link.svg";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-md"
    >
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center sticky">
        <Link to="/home">
          <div className="flex items-center">
            <img src={Logo} alt="" />

            <h1 className="text-2xl font-bold text-[#002395]">ShortLink</h1>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">
              Welcome, {user?.name.split(" ")[0]}!
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="md:flex items-center space-x-2 px-4 py-2 bg-[#002395] text-white rounded-lg hover:bg-red-600 transition-colors  hidden"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
