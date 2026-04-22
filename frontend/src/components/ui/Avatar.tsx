import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

export const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  fallback,
}: AvatarProps) => {
  const sizes = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-40 h-40 text-xl',
  };

  const [imageError, setImageError] = React.useState(false);

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  const initials = fallback || alt.slice(0, 2).toUpperCase();

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold
        ${className}
      `}
    >
      {initials}
    </div>
  );
};
