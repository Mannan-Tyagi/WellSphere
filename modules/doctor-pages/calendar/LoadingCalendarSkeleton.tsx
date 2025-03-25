import React from 'react';

export const LoadingCalendarSkeleton: React.FC = () => {
  return (
    <div className="h-screen w-full bg-white p-6">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-1/4 bg-slate-200 rounded-md animate-pulse mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <div className="h-10 w-24 bg-slate-200 rounded-md animate-pulse"></div>
            <div className="h-10 w-24 bg-slate-200 rounded-md animate-pulse"></div>
          </div>
          <div className="h-10 w-40 bg-slate-200 rounded-md animate-pulse"></div>
        </div>
      </div>
      
      {/* Calendar View Skeleton */}
      <div className="border border-slate-200 rounded-lg h-[calc(100vh-120px)] overflow-hidden">
        {/* Week Days Header */}
        <div className="flex border-b border-slate-200 p-3">
          <div className="w-20 h-10 bg-slate-200 rounded-md animate-pulse"></div>
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-1 mx-1">
              <div className="h-10 bg-slate-200 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Time Slots */}
        <div className="overflow-y-auto h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex border-b border-slate-100">
              <div className="w-20 py-4 px-2">
                <div className="h-6 w-16 bg-slate-200 rounded-md animate-pulse"></div>
              </div>
              {[...Array(7)].map((_, j) => (
                <div key={j} className="flex-1 p-2 border-l border-slate-100">
                  {/* Random appointment placeholders */}
                  {Math.random() > 0.7 && (
                    <div className="h-12 bg-slate-200 rounded-md animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};