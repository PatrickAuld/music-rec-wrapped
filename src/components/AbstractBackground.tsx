interface AbstractBackgroundProps {
  variant?: 'landing' | 'viewer';
}

export default function AbstractBackground({ variant = 'landing' }: AbstractBackgroundProps) {
  const variantClass = variant === 'viewer' ? 'abstract-bg--viewer' : 'abstract-bg--landing';

  return (
    <div className={`abstract-bg ${variantClass}`} aria-hidden>
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />
    </div>
  );
}
