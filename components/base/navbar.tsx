'use client';

import React from 'react';
import { motion, useScroll } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function NavBar(): JSX.Element {
  const { scrollY } = useScroll();

  return (
    <motion.nav
      className="fixed top-0 z-[9999] w-full"
      style={{
        backgroundColor:
          scrollY.get() > 10 ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
      }}
      initial={{ backdropFilter: 'blur(0px)' }}
      animate={{
        backdropFilter: scrollY.get() > 10 ? 'blur(10px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-lg font-bold text-primary md:text-2xl">
          Ayoko
        </Link>
        <div className="hidden items-center space-x-6 md:flex">
          <Link href="/catalogue" className="text-primary">
            Catalogue
          </Link>
          <Button variant="ghost">
            <Search size={24} />
          </Button>
        </div>
        <Button className="md:hidden" variant="ghost">
          <Search size={24} />
        </Button>
      </div>
    </motion.nav>
  );
}
