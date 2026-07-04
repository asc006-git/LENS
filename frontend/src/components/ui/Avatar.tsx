interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const colors = [
  'bg-primary-500',
  'bg-accent-500',
  'bg-warning-500',
  'bg-error-500',
  'bg-success-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
];

function getColorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ src, alt, name, size = 'md' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  if (name) {
    return (
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-medium text-white ${getColorFromName(name)}`}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-secondary-200 flex items-center justify-center`}>
      <span className="text-secondary-500">?</span>
    </div>
  );
}
