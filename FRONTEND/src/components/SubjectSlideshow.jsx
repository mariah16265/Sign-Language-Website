import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Updated SubjectSlideshow component
// Updated SubjectSlideshow component
const SubjectSlideshow = ({ subjects }) => {
  const navigate = useNavigate();
  const [currentIndex] = useState(0);
  const currentSubject = subjects[currentIndex];
  const lessonCount = currentSubject.lessons.length;
  if (currentSubject.lessons.length === 0) {
    return (
      <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentSubject.gradient}`}
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]" />
        </div>
        <div className="relative h-full flex items-center justify-center p-6 text-white">
          <p>No lessons scheduled for today</p>
        </div>
      </div>
    );
  }
  // Calculate grid columns and lesson sizes
  const getLayoutConfig = () => {
    switch (lessonCount) {
      case 1:
        return { grid: 'grid-cols-1', size: 'p-4 text-base',titleSize: 'text-xl' };
      case 2:
        return { grid: 'grid-cols-2', size: 'p-3 text-sm',titleSize: 'text-lg' };
      case 3:
        return { grid: 'grid-cols-3', size: 'p-3 text-xs', titleSize: 'text-base' };
      case 4:
        return { grid: 'grid-cols-2 sm:grid-cols-4', size: 'p-2 text-xs',titleSize: 'text-base' };
      case 5:
        return { grid: 'grid-cols-5', size: 'p-2 text-xs',titleSize: 'text-sm' };
      default:
        return { grid: 'grid-cols-2 sm:grid-cols-3', size: 'p-2 text-xs',titleSize: 'text-sm' };
    }
  };

  const { grid, size, titleSize } = getLayoutConfig();

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
          {currentSubject.lessons.map((lesson) => (
            <motion.button
              key={lesson.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center justify-center ${size} bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all`}
              onClick={() => navigate(lesson.path)}
            >
              <span className="text-2xl mb-1">{lesson.emoji}</span>
              <h2 className={`${titleSize} font-semibold mb-4`}>Module: {lesson.moduleName}</h2>
              <h4 className="font-bold text-center">{lesson.title}</h4>
              <p className="text-[0.7rem] opacity-90 text-center">
                {lesson.subtitle}
              </p>
              <div className="w-full bg-white/30 rounded-full h-1.5 mt-2">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${lesson.progress}%` }}
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
