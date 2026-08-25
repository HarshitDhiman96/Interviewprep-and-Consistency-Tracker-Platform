import { motion } from "framer-motion";

const SpotlightButton = ({ children, className, ...props }) => {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`rounded-lg bg-slate-950 px-4 py-3 font-medium text-white shadow-sm transition-colors hover:bg-slate-800 ${className || ''}`}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default SpotlightButton;
