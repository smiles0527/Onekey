import React from 'react';
import { motion } from 'framer-motion';

const VTC: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ width: '100%', height: 'calc(100vh - 4.5rem)' }}
    >
      <iframe
        src="https://voluntaryteachingforchina.wordpress.com/"
        title="Voluntary Teaching for China"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </motion.div>
  );
};

export default VTC;
