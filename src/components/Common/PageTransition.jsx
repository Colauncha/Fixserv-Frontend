import React from "react";
import { AnimatePresence, motion } from "motion/react";
// import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.995,
  },
};

const pageTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1],
};

const PageTransition = ({ className = "" }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className={className}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;