import { useEffect, useRef, useState } from "react";

interface SwipeHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  className?: string;
}

interface TouchPosition {
  x: number;
  y: number;
}

export default function SwipeHandler({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  minSwipeDistance = 50,
  maxSwipeTime = 300,
  className = ""
}: SwipeHandlerProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<TouchPosition | null>(null);
  const touchTimeRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      touchStartRef.current = { x: startX, y: startY };
      touchTimeRef.current = startTime;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      // Prevent scrolling during swipe
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      
      // If horizontal swipe is more dominant, prevent vertical scrolling
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || !touchTimeRef.current) {
        setIsDragging(false);
        return;
      }

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      setIsDragging(false);
      touchStartRef.current = null;
      touchTimeRef.current = null;

      // Check if it's a valid swipe
      if (deltaTime > maxSwipeTime) return;
      if (Math.max(absX, absY) < minSwipeDistance) return;

      // Determine swipe direction
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    };

    const handleTouchCancel = () => {
      setIsDragging(false);
      touchStartRef.current = null;
      touchTimeRef.current = null;
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance, maxSwipeTime]);

  return (
    <div 
      ref={elementRef} 
      className={`${className} ${isDragging ? 'select-none' : ''}`}
      style={{ touchAction: 'pan-y' }} // Allow vertical scrolling but handle horizontal swipes
    >
      {children}
    </div>
  );
}