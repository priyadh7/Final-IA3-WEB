import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, gradient, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-2xl group overflow-hidden relative">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${gradient.split(' ')[0].replace('from-', '')}15, transparent 70%)`
          }}
        />
        
        <CardContent className="p-6 space-y-4 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow`}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Hover indicator */}
          <motion.div
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            className="h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
}

export function FloatingElement({ children, delay = 0, yOffset = 20, duration = 3 }: FloatingElementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ 
        opacity: 1, 
        y: [yOffset, -yOffset, yOffset],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay }
      }}
    >
      {children}
    </motion.div>
  );
}

export function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

interface PulsingBadgeProps {
  children: React.ReactNode;
}

export function PulsingBadge({ children }: PulsingBadgeProps) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-primary"
      />
      {children}
    </motion.div>
  );
}
