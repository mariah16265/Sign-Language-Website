import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiHand } from 'react-icons/gi';
import { FaSignLanguage } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Navbar = ({ hideLoginButton = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = ['Home', 'About', 'Curriculum'];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      {/* Logo */}
      <motion.div
        className="flex items-center space-x-3"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <GiHand className="text-4xl text-purple-600" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
          LittleSigns
        </h1>
      </motion.div>

      {/* Desktop Nav */}
      <ul className="hidden md:flex space-x-6 font-medium text-purple-800 text-lg items-center">
        {navLinks.map((item) => (
          <motion.li
            key={item}
            className="hover:text-purple-500 transition-colors flex items-center"
            whileHover={{ scale: 1.1 }}
          >
            <Link to={`/${item.toLowerCase()}`} className="flex items-center">
              {item}
            </Link>
          </motion.li>
        ))}
        {!hideLoginButton && (
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full shadow hover:shadow-md transition-all flex items-center font-bold hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 active:scale-95"
            >
              Login <FaSignLanguage className="ml-2" />
            </Link>
          </motion.li>
        )}
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-3xl text-purple-600"
        onClick={toggleMenu}
      >
        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-4 bg-white border shadow-md rounded-lg p-4 w-52 flex flex-col space-y-4 z-50"
        >
          {navLinks.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="text-purple-800 hover:text-purple-500 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          {!hideLoginButton && (
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-center font-bold hover:from-purple-600 hover:to-purple-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
