// components/FloatingEmojis.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const emojis = [
  '🌈','⭐','🌟','✨','🎈','🎀','🎁','🧸','🦄','🐝','🦋','🐞',
  '🐶','🐱','🦁','🐯','🦊','🐻','🐧','🦉','🐙','🦕','🚀','🎠',
  '🎪','🎨','🧩','🎯','🍎','🍭','🍪','🧁','👋','✋','🤚','📚',
  '✏️','🎨','🖍️','🎮','🧩','🎲','🏆','🎵','🎶','🎤','🎧',
  '🎭','🤹','🎪',
];

const colors = [
  '#a78bfa','#f9a8d4','#93c5fd','#86efac','#fde047',
  '#fca5a5','#7dd3fc','#c4b5fd','#bef264','#fda4af',
];

const FloatingEmojis = () => {
  // Run only once
  const emojiData = useMemo(() => {
    return [...Array(60)].map((_, i) => {
      const row = Math.floor(i / 10);
      const col = i % 10;
      const startX = col * 10 + Math.random() * 5;
      const startYOffset = row * 12;
      const driftAmount = (Math.random() * 60 - 30) * (1 + row * 0.1);
      const rotation = Math.random() * 360;
      const size = `${Math.random() * 16 + 16}px`;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const duration = 15 + row * 1.5;
      const delay = col * 0.03;
      const color = colors[i % colors.length];

      return { i, startX, startYOffset, driftAmount, rotation, size, emoji, duration, delay, color };
    });
  }, []);

  return emojiData.map(({ i, startX, startYOffset, driftAmount, rotation, size, emoji, duration, delay, color }) => (
    <motion.div
      key={i}
      className="absolute pointer-events-none select-none will-change-transform"
      style={{
        left: `${startX}vw`,
        top: `${80 + startYOffset}vh`,
        fontSize: size,
        color: color,
        zIndex: 0,
        filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
      }}
      initial={{ y: 0, opacity: 0.8 }}
      animate={{
        y: [-100, -400, -700, -1000, -1300],
        x: [
          0,
          driftAmount * 0.3,
          driftAmount * 0.7,
          driftAmount,
          driftAmount * 0.5,
        ],
        rotate: [
          rotation,
          rotation + 180,
          rotation + 360,
          rotation + 540,
          rotation + 720,
        ],
        opacity: [0.8, 0.9, 0.7, 0.5, 0.2, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: [0.4, 0.6, 0.2, 0.1],
      }}
    >
      {emoji}
    </motion.div>
  ));
};

export default FloatingEmojis;
