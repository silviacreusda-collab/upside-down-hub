import { useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];
  intervalMs?: number;
  className?: string;
};

export const BackgroundRotator = ({ images, intervalMs = 12000, className }: Props) => {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  useEffect(() => {
    if (safeImages.length <= 1) return;

    const id = window.setInterval(() => {
      setPrevIndex(activeIndex);
      setActiveIndex((i) => (i + 1) % safeImages.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [activeIndex, intervalMs, safeImages.length]);

  const active = safeImages[activeIndex];
  const prev = prevIndex !== null ? safeImages[prevIndex] : null;

  return (
    <div className={className}>
      {prev && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-1000"
          style={{ backgroundImage: `url(${prev})` }}
        />
      )}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 transition-opacity duration-1000"
        style={{ backgroundImage: `url(${active})` }}
      />
    </div>
  );
};
