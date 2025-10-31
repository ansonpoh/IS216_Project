import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        y: 30,
        scale: 0.98
      }}
      animate={{ 
        opacity: 1,
        y: 0,
        scale: 1
      }}
      exit={{ 
        opacity: 0,
        y: -30,
        scale: 0.98
      }}
      transition={{
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96], // Improved easing curve
        opacity: { duration: 0.6 },
        scale: { duration: 0.5 }
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;