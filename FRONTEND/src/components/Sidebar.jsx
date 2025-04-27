import { FaBookOpen, FaPuzzlePiece, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="lg:w-64 w-full bg-gradient-to-b from-indigo-600 to-purple-600 shadow-lg px-6 py-8 flex flex-col rounded-none lg:rounded-r-3xl">
      {/* Top Spacer */}
      <div className="h-10"></div>

      {/* Navigation Buttons with Equal Spacing */}
      <nav className="flex flex-col gap-5 mt-6">
        {[
          {
            icon: <FaBookOpen className="text-xl" />,
            label: 'Learn',
            color: 'bg-pink-500 hover:bg-pink-600',
          },
          {
            icon: <FaPuzzlePiece className="text-xl" />,
            label: 'Quiz',
            color: 'bg-amber-500 hover:bg-amber-600',
          },
          {
            icon: <FaChartBar className="text-xl" />,
            label: 'Progress',
            color: 'bg-emerald-500 hover:bg-emerald-600',
          },
        ].map(({ icon, label, color }, index) => (
          <button
            key={index}
            className={`flex items-center gap-3 p-4 text-white rounded-lg transition-all ${color} hover:scale-[1.02] shadow-md`}
            onClick={() => navigate(`/${label.toLowerCase()}`)}
          >
            {icon}
            <span className="font-medium text-lg">{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Spacer */}
      <div className="flex-grow"></div>
    </div>
  );
};

export default Sidebar;
