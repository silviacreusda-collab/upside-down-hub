import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

export const FloatingParticles = ({ count = 30 }: { count?: number }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 20,
        duration: Math.random() * 15 + 15,
      });
    }
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-neon-red/40 blur-[1px]"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float-particle ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
