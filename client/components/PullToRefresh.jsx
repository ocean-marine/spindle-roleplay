import { useState, useRef, useEffect } from "react";
import { RefreshCw } from "react-feather";

export default function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80,
  className = ""
}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const containerRef = useRef(null);
  const startTouchRef = useRef(null);
  const pullStartedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e) => {
      // Only start pull if we're at the top of the scrollable area
      if (container.scrollTop <= 0) {
        startY = e.touches[0].clientY;
        startTouchRef.current = startY;
        setCanPull(true);
        pullStartedRef.current = false;
      }
    };

    const handleTouchMove = (e) => {
      if (!canPull || !startTouchRef.current) return;

      currentY = e.touches[0].clientY;
      const pullDistance = Math.max(0, currentY - startTouchRef.current);

      // Only start the pull effect if we're pulling down significantly
      if (pullDistance > 10 && container.scrollTop <= 0) {
        pullStartedRef.current = true;
        e.preventDefault(); // Prevent scrolling
        
        // Apply resistance to make it feel natural
        const resistance = Math.min(pullDistance * 0.6, threshold * 1.5);
        setPullDistance(resistance);
      }
    };

    const handleTouchEnd = () => {
      if (!pullStartedRef.current) {
        setCanPull(false);
        setPullDistance(0);
        return;
      }

      setCanPull(false);
      
      if (pullDistance >= threshold && onRefresh && !isRefreshing) {
        setIsRefreshing(true);
        
        // Call the refresh function
        const refreshPromise = onRefresh();
        
        // Handle the refresh completion
        const handleRefreshComplete = () => {
          setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
          }, 500); // Add a small delay for better UX
        };

        if (refreshPromise && typeof refreshPromise.then === 'function') {
          refreshPromise.finally(handleRefreshComplete);
        } else {
          handleRefreshComplete();
        }
      } else {
        // Animate back to 0
        setPullDistance(0);
      }
    };

    // Add event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canPull, pullDistance, threshold, onRefresh, isRefreshing]);

  const refreshIconRotation = isRefreshing ? 'animate-spin' : 
    pullDistance >= threshold ? 'rotate-180' : 
    `rotate-${Math.min(180, (pullDistance / threshold) * 180)}`;

  return (
    <div ref={containerRef} className={`relative overflow-auto ${className}`}>
      {/* Pull to refresh indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 z-10"
        style={{ 
          transform: `translateY(${Math.max(-60, pullDistance - 60)}px)`,
          opacity: pullDistance > 20 ? 1 : 0
        }}
      >
        <div className={`bg-white rounded-full shadow-lg p-3 flex items-center gap-2 ${
          pullDistance >= threshold ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'
        }`}>
          <RefreshCw 
            size={20} 
            className={`transition-all duration-300 ${
              pullDistance >= threshold ? 'text-green-600' : 'text-gray-600'
            } ${refreshIconRotation}`}
          />
          <span className={`text-sm font-medium transition-colors ${
            pullDistance >= threshold ? 'text-green-600' : 'text-gray-600'
          }`}>
            {isRefreshing ? 'Refreshing...' : 
             pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div 
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: canPull && pullStartedRef.current ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}