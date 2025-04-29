import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiHand } from 'react-icons/gi';
import { FaSignLanguage } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';
import { FaUser } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

const Navbar = ({ hideLoginButton = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const location = useLocation();   //to get current page path

  const isLandingPage = location.pathname === '/';
  const isSignupPage = location.pathname === '/signup';
  const isLoginPage = location.pathname === '/login';
  // Login button to be show for landing and sign up page, for others show username
  const shouldShowLoginButton = (isLandingPage || isSignupPage);
  const shouldShowUsername = (!isLandingPage && !isSignupPage && !isLoginPage && userName);

  const navLinks = ['Home', 'About', 'Curriculum'];

  //get username
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    if (token && storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiry'); 
    localStorage.removeItem('isNewUser');
    setUserName(''); 
    navigate('/login');
  };

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
            {/*<Link to={`/${item.toLowerCase()}`} className="flex items-center">*/}
            <Link to="/" className="flex items-center">   
              {item}
            </Link>
          </motion.li>
        ))}
      {/* Show username and dropdown if logged in */}
      {shouldShowUsername ? (
        <motion.li>
          <div className="relative flex items-center">
          {/* Username Box */}
            <div className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold flex items-center gap-3 rounded-full">
              Hi, {userName}
          
              {/* Icon + Arrow - only this clickable */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <FaUser className="text-white" />
                  <span className="text-sm">&#x25BC;</span> {/* ▼ arrow */}
                </motion.div>
              </div>
              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-14 right-0 bg-gradient-to-br from-white to-gray-100 border-2 border-purple-600 shadow-lg rounded-2xl w-full p-2 flex flex-col space-y-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-purple-700 hover:text-purple-500 transition-colors font-semibold w-full py-2 px-3 rounded-md"
                  >
                    <FiLogOut className="text-lg" />
                    Log Out
                  </button>
                </div>
              )}
          </div>
        </motion.li>
        ) : (
        shouldShowLoginButton && (  // Otherwise show login button
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full shadow hover:shadow-md transition-all flex items-center font-bold hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 active:scale-95"
            >
              Login <FaSignLanguage className="ml-2" />
            </Link>
          </motion.li>
        )
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
      {/* Show username and logout in mobile if logged in */}
      {shouldShowUsername ? (
        <div className="relative flex items-center mt-3">
          {/* Username Box */}
          <div className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold flex items-center gap-3 rounded-full">
            Hi, {userName}

            {/* Icon + Arrow - only this clickable */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <FaUser className="text-white" />
              <span className="text-sm">&#x25BC;</span> {/* ▼ arrow */}
            </motion.div>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-14 right-0 bg-gradient-to-br from-white to-gray-100 border-2 border-purple-600 shadow-lg rounded-2xl flex p-3 flex-col space-y-2 z-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-500 transition-colors font-semibold py-2 px-4 rounded-md w-full"
              >
                <FiLogOut className="text-lg" />
                Log Out
              </button>
            </div>
          )}
        </div>
        ) : (
          shouldShowLoginButton && (
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-center font-bold hover:from-purple-600 hover:to-purple-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )
        )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;