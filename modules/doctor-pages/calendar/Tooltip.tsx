"use client";

import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyles, setTooltipStyles] = useState({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let top, left;

    switch (position) {
      case 'top':
        top = childRect.top - tooltipRect.height - 8 + scrollTop;
        left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2) + scrollLeft;
        break;
      case 'right':
        top = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2) + scrollTop;
        left = childRect.right + 8 + scrollLeft;
        break;
      case 'bottom':
        top = childRect.bottom + 8 + scrollTop;
        left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2) + scrollLeft;
        break;
      case 'left':
        top = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2) + scrollTop;
        left = childRect.left - tooltipRect.width - 8 + scrollLeft;
        break;
      default:
        top = childRect.top - tooltipRect.height - 8 + scrollTop;
        left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2) + scrollLeft;
    }

    // Keep tooltip within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Horizontal adjustment
    if (left < 8) {
      left = 8;
    } else if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }

    // Vertical adjustment
    if (top < 8) {
      top = childRect.bottom + 8 + scrollTop;  // Switch to bottom if not enough space on top
    } else if (top + tooltipRect.height > viewportHeight - 8) {
      top = childRect.top - tooltipRect.height - 8 + scrollTop;  // Switch to top if not enough space on bottom
    }

    setTooltipStyles({
      top: `${top}px`,
      left: `${left}px`,
    });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  // Recalculate position if window is resized
  useEffect(() => {
    if (isVisible) {
      const handleResize = () => calculatePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isVisible]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Determine arrow position class
  const getArrowClass = () => {
    switch (position) {
      case 'top': return 'after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-gray-800';
      case 'right': return 'after:right-full after:top-1/2 after:-translate-y-1/2 after:border-r-gray-800';
      case 'bottom': return 'after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-gray-800';
      case 'left': return 'after:left-full after:top-1/2 after:-translate-y-1/2 after:border-l-gray-800';
      default: return 'after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-gray-800';
    }
  };

  return (
    <>
      <div 
        ref={childRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded shadow-lg pointer-events-none transform transition-opacity duration-200 
            after:absolute after:border-[6px] after:border-transparent ${getArrowClass()} ${className}`}
          style={tooltipStyles}
        >
          {content}
        </div>
      )}
    </>
  );
}