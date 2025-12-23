import { motion } from 'framer-motion';

const AnimatedPage = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.8,
                ease: [0.2, 0, 0.2, 1], // Smooth custom cubic bezier
                opacity: { duration: 0.4 }
            }}
            className="w-full"
            style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                willChange: 'transform, opacity'
            }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
