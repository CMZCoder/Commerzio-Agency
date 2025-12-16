import React, { useEffect, useRef } from 'react';

const SpaceBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let width = window.innerWidth;
        let height = window.innerHeight;

        const setSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        setSize();
        window.addEventListener('resize', setSize);

        // Star properties - more subtle for darker aesthetic
        const numStars = 150; // Reduced from 400
        const stars = [];
        const speed = 0.15; // Much slower, subtle drift
        const depth = 2000; // Deeper space = less dramatic movement

        // Initialize stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * depth,
                o: Math.random() * 0.5 + 0.2 // Lower base opacity (0.2 to 0.7)
            });
        }

        let animationId;

        const animate = () => {
            // Dark background - solid fill for clean look
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, width, height);

            // Draw Stars
            ctx.fillStyle = '#FFFFFF';

            const cx = width / 2;
            const cy = height / 2;

            stars.forEach(star => {
                // Move star towards screen (very slowly)
                star.z -= speed;

                // Reset moves to back
                if (star.z <= 0) {
                    star.z = depth;
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                }

                // Project 3D -> 2D with reduced scaling for less warp
                const k = 80.0 / star.z; // Reduced from 128 for less dramatic perspective
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    // Smaller size, less dramatic scaling
                    const size = (1 - star.z / depth) * 1.5; // Reduced from 2.5
                    // Lower opacity overall
                    const opacity = (1 - star.z / depth) * star.o * 0.6; // Added 0.6 multiplier

                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.arc(px, py, size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setSize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                // Ensure it acts as background but sits nicely
                pointerEvents: 'none'
            }}
        />
    );
};

export default SpaceBackground;
