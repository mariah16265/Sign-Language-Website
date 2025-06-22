import React from 'react';
import { motion } from 'framer-motion';

const StepProgressBar = ({ steps }) => (
  <div className="flex items-center justify-center max-w-full px-4 gap-4 select-none">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{
              scale: step.current ? 1.2 : 1,
              background: step.completed
                ? 'linear-gradient(135deg, #A5B4FC, #6366F1)' // indigo gradient
                : step.current
                ? 'linear-gradient(135deg, #FCD34D, #F59E0B)' // amber gradient
                : '#E5E7EB', // gray
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 400 }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold cursor-default"
          >
            {step.completed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className="stroke-white"
                />
              </svg>
            ) : (
              <span
                className={`${
                  step.current ? 'text-amber-100' : 'text-gray-500'
                } text-md`}
              >
                {i + 1}
              </span>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={`text-xs font-medium mt-3 ${
              step.current
                ? 'text-amber-600'
                : step.completed
                ? 'text-indigo-600'
                : 'text-gray-400'
            }`}
          >
            {step.label}
          </motion.div>
        </div>

        {i !== steps.length - 1 && (
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 1 }}
            className={`h-0.5 w-8 rounded-full ${
              step.completed ? 'bg-indigo-300' : 'bg-gray-200'
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default StepProgressBar;
