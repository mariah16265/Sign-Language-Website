import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GiHand } from 'react-icons/gi';
import { FaSignLanguage, FaUser } from 'react-icons/fa';
import { FiMenu, FiX, FiEdit, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Navbar = ({ hideLoginButton = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const getColorScheme = () => {
    switch (location.pathname) {
      case '/':
        return {
          bg: 'bg-white',
          text: 'from-sky-600 to-blue-600',
          icon: 'text-sky-600',
          button: 'from-sky-300 to-sky-400',
          buttonHover: 'from-sky-400 to-sky-500',
          navText: 'text-sky-700 hover:text-sky-600',
          border: 'border-sky-400',
        };

      case '/signup':
        return {
          bg: 'bg-pink-50',
          text: 'from-pink-600 to-fuchsia-500', // Updated text gradient
          icon: 'text-pink-600',
          button: 'from-fuchsia-500 to-pink-500',
          buttonHover: 'from-pink-600 to-fuchsia-600',
          navBg: 'bg-pink-50',
          navText: 'text-pink-700 hover:text-fuchsia-500',
          border: 'border-pink-400',
        };

      case '/login':
        return {
          bg: 'bg-gradient-to-r from-amber-100 to-amber-50',
          text: 'from-orange-600 to-yellow-500', // Updated text gradient
          icon: 'text-orange-500',
          button: 'from-yellow-500 to-orange-400',
          buttonHover: 'from-orange-500 to-orange-600',
          navText: 'text-orange-700 hover:text-orange-500',
          border: 'border-orange-400',
        };
      case '/dashboard':
        return {
          bg: 'bg-white',
          text: 'from-orange-600 to-orange-400', // Updated text gradient
          icon: 'text-orange-600',
          button: 'bg-orange-400',
          buttonHover: 'bg-orange-500',
          navText: 'text-orange-700 hover:text-orange-900',
          border: 'border-orange-300',
        };

      case '/studyplan':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-green-100',
          text: 'from-green-600 to-lime-500', // Updated text gradient
          icon: 'text-green-600',
          button: 'from-lime-500 to-green-500',
          buttonHover: 'from-green-600 to-green-700',
          navText: 'text-green-700 hover:text-green-500',
          border: 'border-green-500',
        };
      default:
        return {
          bg: 'bg-white',
          text: 'from-orange-600 to-orange-400', // Updated text gradient
          icon: 'text-orange-600',
          button: 'bg-orange-400',
          buttonHover: 'bg-orange-500',
          navText: 'text-orange-700 hover:text-orange-900',
          border: 'border-orange-300',
        };
    }
  };

  const colors = getColorScheme();

  const navLinks = ['Home', 'About', 'Curriculum'];
  const isLandingPage = location.pathname === '/';
  const isSignupPage = location.pathname === '/signup';
  const isLoginPage = location.pathname === '/login';
  const shouldShowLoginButton =
    (isLandingPage || isSignupPage) && !hideLoginButton;
  const shouldShowUsername =
    !isLandingPage && !isSignupPage && !isLoginPage && userName;

  // Get username from localStorage
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
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleEditStudyPlan = () => {
    navigate('/studyplan?edit=true');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`${colors.bg} shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40 transition-colors duration-300`}
    >
      {/* Logo - fixed alignment */}
      <motion.div
        className="flex items-center space-x-3"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <GiHand className={`text-4xl ${colors.icon}`} />
        <h1
          className={`text-2xl sm:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r ${colors.text} tracking-tight`}
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          LittleSigns
        </h1>
      </motion.div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-6 font-medium text-lg items-center">
        {navLinks.map((item) => (
          <motion.li
            key={item}
            className={`${colors.navText} transition-colors flex items-center`}
            whileHover={{ scale: 1.1 }}
          >
            <Link to="/" className="flex items-center">
              {item}
            </Link>
          </motion.li>
        ))}

        {shouldShowUsername ? (
          <motion.li>
            <div className="relative flex items-center">
              <div className="px-6 py-2 bg-orange-400 text-white font-semibold flex items-center gap-3 rounded-full">
                Hi, {userName}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <FaUser className="text-pink" />
                  <span className="text-sm">&#x25BC;</span>
                </motion.div>
              </div>

              {isDropdownOpen && (
                <div
                  className={`absolute top-14 right-0 bg-white border-2 ${colors.border} shadow-lg rounded-2xl w-full p-2 flex flex-col space-y-2 z-50`}
                >
                  <button
                    onClick={handleEditStudyPlan}
                    className={`flex items-center gap-2 ${colors.navText} transition-colors font-semibold w-full py-2 px-3 rounded-md text-sm`}
                  >
                    <FiEdit className="text-base" />
                    Edit StudyPlan
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 ${colors.navText} transition-colors font-semibold w-full py-2 px-3 rounded-md text-sm`}
                  >
                    <FiLogOut className="text-base" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </motion.li>
        ) : (
          shouldShowLoginButton && (
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className={`bg-gradient-to-r ${colors.button} text-white px-6 py-2 rounded-full shadow hover:shadow-md transition-all flex items-center font-bold hover:bg-gradient-to-r ${colors.buttonHover} transform hover:scale-105 active:scale-95`}
              >
                Login <FaSignLanguage className="ml-2" />
              </Link>
            </motion.li>
          )
        )}
      </ul>

      {/* Mobile Menu Button */}
      <button
        className={`md:hidden text-3xl ${colors.icon}`}
        onClick={toggleMenu}
      >
        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
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
              className={`${colors.navText} font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}

          {shouldShowUsername ? (
            <div className="relative flex flex-col mt-3 space-y-2">
              <div
                className={`px-4 py-2 bg-gradient-to-r ${colors.button} text-white font-semibold flex items-center justify-between rounded-full`}
              >
                <span>Hi, {userName}</span>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <FaUser className="text-white" />
                  <span className="text-sm">&#x25BC;</span>
                </motion.div>
              </div>

              {isDropdownOpen && (
                <div
                  className={`bg-white border ${colors.border} rounded-lg p-2 flex flex-col space-y-2 mt-2`}
                >
                  <button
                    onClick={handleEditStudyPlan}
                    className={`flex items-center gap-2 ${colors.navText} transition-colors font-semibold w-full py-2 px-3 rounded-md`}
                  >
                    <FiEdit className="text-lg" />
                    Edit StudyPlan
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 ${colors.navText} transition-colors font-semibold py-2 px-4 rounded-md w-full`}
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
                className={`bg-gradient-to-r ${colors.button} text-white px-4 py-2 rounded-full text-center font-bold hover:bg-gradient-to-r ${colors.buttonHover}`}
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
