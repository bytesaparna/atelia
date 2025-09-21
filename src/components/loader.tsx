"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Loader = ({
    text,
    duration = 0.3,
    automatic = false,
}: {
    text: string;
    duration?: number;
    automatic?: boolean;
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

    useEffect(() => {
        if (svgRef.current && cursor.x !== null && cursor.y !== null) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
            const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
            setMaskPosition({
                cx: `${cxPercentage}%`,
                cy: `${cyPercentage}%`,
            });
        }
    }, [cursor]);

    // Auto-animate the mask position for loading effect
    useEffect(() => {
        if (automatic) {
            const interval = setInterval(() => {
                const randomX = Math.random() * 100;
                const randomY = Math.random() * 100;
                setMaskPosition({
                    cx: `${randomX}%`,
                    cy: `${randomY}%`,
                });
            }, 800);

            return () => clearInterval(interval);
        }
    }, [automatic]);

    return (
        <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 300 100"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => !automatic && setHovered(true)}
            onMouseLeave={() => !automatic && setHovered(false)}
            onMouseMove={(e) => !automatic && setCursor({ x: e.clientX, y: e.clientY })}
            className="select-none"
        >
            <defs>
                <linearGradient
                    id="textGradient"
                    gradientUnits="userSpaceOnUse"
                    cx="50%"
                    cy="50%"
                    r="25%"
                >
                    <stop offset="0%" stopColor="hsl(45 93% 47%)" />
                    <stop offset="25%" stopColor="hsl(0 72% 51%)" />
                    <stop offset="50%" stopColor="hsl(212 100% 50%)" />
                    <stop offset="75%" stopColor="hsl(185 84% 44%)" />
                    <stop offset="100%" stopColor="hsl(262 83% 58%)" />
                </linearGradient>

                <motion.radialGradient
                    id="revealMask"
                    gradientUnits="userSpaceOnUse"
                    r={automatic ? "30%" : "20%"}
                    initial={{ cx: "50%", cy: "50%" }}
                    animate={maskPosition}
                    transition={{
                        duration: automatic ? 1.5 : duration,
                        ease: automatic ? "easeInOut" : "easeOut"
                    }}
                >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                </motion.radialGradient>
                <mask id="textMask">
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#revealMask)"
                    />
                </mask>
            </defs>

            {/* Background text */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.3"
                className="fill-transparent stroke-neutral-700 font-mono text-7xl font-bold dark:stroke-neutral-600"
                style={{ opacity: automatic || hovered ? 0.8 : 0 }}
            >
                {text}
            </text>

            {/* Animated stroke outline */}
            <motion.text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.3"
                className="fill-transparent stroke-neutral-600 font-mono text-7xl font-bold dark:stroke-neutral-500"
                initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
                animate={{
                    strokeDashoffset: 0,
                    strokeDasharray: 1000,
                }}
                transition={{
                    duration: automatic ? 3 : 4,
                    ease: "easeInOut",
                    repeat: automatic ? Infinity : 0,
                    repeatType: "loop",
                }}
            >
                {text}
            </motion.text>

            {/* Gradient filled text with mask */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                stroke="url(#textGradient)"
                strokeWidth="0.3"
                mask="url(#textMask)"
                className="fill-transparent font-mono text-7xl font-bold"
            >
                {text}
            </text>
        </svg>
    );
};