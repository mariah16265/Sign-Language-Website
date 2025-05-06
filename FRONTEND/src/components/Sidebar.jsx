import { FaBookOpen, FaPuzzlePiece, FaChartBar, FaChalkboardTeacher} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      icon: <FaChalkboardTeacher className="text-2xl" />, 
      label: 'Dashboard',
      color: 'bg-sky-400 hover:bg-sky-500',
      path: '/dashboard',
    },
    {
      icon: <FaBookOpen className="text-2xl" />, 
      label: 'Learn',
      color: 'bg-pink-500 hover:bg-pink-600',
      path: '/learn',
    },
    {
      icon: <FaPuzzlePiece className="text-2xl" />,
      label: 'Quiz',
      color: 'bg-amber-500 hover:bg-amber-600',
      path: '/quiz',
    },
    {
      icon: <FaChartBar className="text-2xl" />,
      label: 'Progress',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      path: '/progress',
    },
  ];

  return (
    <div className="lg:w-64 w-full bg-gradient-to-b from-indigo-600 to-purple-600 shadow-lg px-6 py-8 flex flex-col rounded-none lg:rounded-r-3xl">
      <div className="h-10"></div>

      <nav className="flex flex-col gap-5 mt-6">
        {tabs.map(({ icon, label, color, path }, index) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <button
              key={index}
              className={`relative flex items-center gap-3 pl-5 pr-6 py-4 text-white rounded-lg transition-all shadow-md ${color} hover:scale-[1.02] overflow-hidden ${isActive ? 'ring-4 ring-white ring-offset-2 ring-offset-indigo-600 scale-[1.03]' : ''}`}
              onClick={() => navigate(path)}
            >
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full animate-pulse"></span>
              )}
              {icon}
              <span className="font-bold text-lg drop-shadow-sm tracking-wide">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex-grow"></div>
    </div>
  );
};

export default Sidebar;
