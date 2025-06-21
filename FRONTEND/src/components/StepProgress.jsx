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
              scale: step.current ? 1.3 : 1,
              background: step.completed
                ? "linear-gradient(135deg, #D8B4FE, #8B5CF6)"
                : step.current
                ? "linear-gradient(135deg, #34D399, #059669)"
                : "#E5E7EB",
              boxShadow: step.current
                ? "0 0 10px 4px rgba(16,185,129,0.7)"
                : step.completed
                ? "0 0 10px 3px rgba(139,92,246,0.6)"
                : "none",
            }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold cursor-default"
          >
            {step.completed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
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
                  step.current ? "text-green-400" : "text-gray-400"
                }`}
              >
                {i + 1}
              </span>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className={`mt-1 text-xs font-semibold ${
              step.current
                ? "text-green-500"
                : step.completed
                ? "text-purple-500"
                : "text-gray-400"
            }`}
          >
            {step.label}
          </motion.div>
        </div>

        {i !== steps.length - 1 && (
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            style={{ originX: 0 }}
            className="h-1 w-12 rounded bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default StepProgressBar;
