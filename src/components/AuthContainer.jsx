import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AuthBackground from './AuthBackground';

const AuthContainer = () => {
    const location = useLocation();
    const isRegister = location.pathname === '/register';

    // Stable motion value for base rotation
    const flipRotation = useMotionValue(isRegister ? 180 : 0);
    const springRotation = useSpring(flipRotation, {
        stiffness: 120,
        damping: 20,
        mass: 1.2
    });

    // Sync rotation with location change
    useEffect(() => {
        animate(flipRotation, isRegister ? 180 : 0, {
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1.2
        });
    }, [isRegister, flipRotation]);

    // Mouse tilt effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 100, damping: 30 });
    const rotateYOffset = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 100, damping: 30 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // Combine flip rotation with mouse tilt
    const finalRotateY = useTransform([springRotation, rotateYOffset], ([flip, offset]) => flip + offset);

    return (
        <AuthBackground>
            <div
                className="relative z-10 w-full h-full flex items-center justify-center p-4 cursor-default"
                style={{ perspective: '2000px' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <motion.div
                    className="relative w-full max-w-[420px]"
                    style={{
                        transformStyle: 'preserve-3d',
                        rotateX,
                        rotateY: finalRotateY,
                        scale: useTransform(useMotionValue(window.innerWidth), [320, 1024], [0.8, 1]) // Dynamic scale based on width
                    }}
                >
                    {/* FRONT FACE (LOGIN) */}
                    <div
                        className="w-full relative z-20"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'translateZ(30px)' // Reduced depth on mobile
                        }}
                    >
                        <Login isNested />
                    </div>

                    {/* BACK FACE (REGISTER) */}
                    <div
                        className="absolute inset-0 w-full h-fit my-auto"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg) translateZ(30px)', // Reduced depth on mobile
                        }}
                    >
                        <Register isNested />
                    </div>
                </motion.div>
            </div>
        </AuthBackground>
    );
};

export default AuthContainer;
