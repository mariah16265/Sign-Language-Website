import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Updated SubjectSlideshow component
// Updated SubjectSlideshow component
const SubjectSlideshow = ({ subjects }) => {
  const navigate = useNavigate();
  const [currentIndex] = useState(0);
  const currentSubject = subjects[currentIndex];
  const lessonCount = currentSubject.modules.length;

  // Calculate grid columns and lesson sizes
  const getLayoutConfig = () => {
    switch (lessonCount) {
      case 1:
        return { grid: 'grid-cols-1', size: 'p-4 text-base' };
      case 2:
        return { grid: 'grid-cols-2', size: 'p-3 text-sm' };
      case 3:
        return { grid: 'grid-cols-3', size: 'p-3 text-xs' };
      case 4:
        return { grid: 'grid-cols-2 sm:grid-cols-4', size: 'p-2 text-xs' };
      case 5:
        return { grid: 'grid-cols-5', size: 'p-2 text-xs' };
      default:
        return { grid: 'grid-cols-2 sm:grid-cols-3', size: 'p-2 text-xs' };
    }
  };

  const { grid, size } = getLayoutConfig();

  return (
    <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentSubject.gradient}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]" />
      </div>

      <div className="relative h-full flex flex-col p-6 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4"
        >
          <h3 className="text-2xl font-bold">{currentSubject.name}</h3>
          <p className="text-sm">{currentSubject.description}</p>
        </motion.div>

        <div className={`grid ${grid} gap-3 h-full`}>
          {currentSubject.modules.map((module) => (
            <motion.button
              key={module.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center justify-center ${size} bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all`}
              onClick={() => navigate(module.path)}
            >
              <span className="text-2xl mb-1">{module.emoji}</span>
              <h4 className="font-bold text-center">{module.title}</h4>
              <p className="text-[0.7rem] opacity-90 text-center">
                {module.subtitle}
              </p>
              <div className="w-full bg-white/30 rounded-full h-1.5 mt-2">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SubjectSlideshow;
