import { motion } from "motion/react";
import { useEffect, useState } from "react";

const techIcons = ["", "", "", "", "", "", "", ""];

export default function FloatingTech3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {techIcons.map((icon, index) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * 2;
        const randomDuration = 15 + Math.random() * 10;

        return (
          <motion.div
            key={index}
            className="absolute text-4xl"
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
            }}
            initial={{ opacity: 0, scale: 0, rotateY: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              rotateY: [0, 360],
              y: [0, -100, 0],
            }}
            transition={{
              duration: randomDuration,
              delay: randomDelay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {icon}
          </motion.div>
        );
      })}
    </div>
  );
}
