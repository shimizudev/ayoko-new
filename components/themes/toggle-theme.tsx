'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const getCurrentIcon = (theme: string | undefined) => {
  switch (theme) {
    case 'dark': {
      return <Moon />;
    }
    case 'light': {
      return <Sun />;
    }
    default: {
      return <Monitor />;
    }
  }
};

const getNextTheme = (theme: string | undefined) => {
  switch (theme) {
    case 'dark': {
      return 'light';
    }
    case 'light': {
      return 'system';
    }
    default: {
      return 'dark';
    }
  }
};

export default function ToggleTheme(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleToggle = () => {
    const nextTheme = getNextTheme(theme);
    setTheme(nextTheme);
  };

  if (!mounted)
    return (
      <Button className="rounded-full" size="icon">
        <Monitor />
      </Button>
    );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" className="rounded-full" onClick={handleToggle}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {getCurrentIcon(theme)}
              </motion.div>
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
