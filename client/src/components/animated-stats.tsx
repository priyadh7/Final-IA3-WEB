import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedNumber({ value, duration = 2, prefix = "", suffix = "" }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

export function StatCard({ title, value, prefix, suffix, icon, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
      <div className="relative bg-card border-2 rounded-2xl p-6 hover:border-primary/50 transition-all shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
          >
            Live
          </motion.div>
        </div>
        <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </p>
      </div>
    </motion.div>
  );
}
