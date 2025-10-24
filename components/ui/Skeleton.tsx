import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={`bg-outline/50 animate-pulse rounded-md ${className}`} />;
};

export default Skeleton;
