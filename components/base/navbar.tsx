'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Search, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-primary">
      {children}
    </Link>
  );
}

// eslint-disable-next-line react/require-default-props
function SearchButton({ className }: { className?: string }) {
  return (
    <Button className={className} variant="ghost">
      <Search size={24} />
    </Button>
  );
}

function InfoNav({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </Button>
        <Link href="/">
          <Button variant="ghost">
            <Home size={24} />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>

      <div className="hidden items-center space-x-6 md:flex">
        <NavLink href="/catalogue">Catalogue</NavLink>
        <SearchButton />
      </div>

      <SearchButton className="md:hidden" />
    </div>
  );
}

const checkIsInfoPage = () => {
  const pathname = usePathname();

  const isInfoPage = ['/anime', '/manga', '/watch'].includes(
    `/${pathname.split('/')[1]}`
  );

  return isInfoPage;
};

// eslint-disable-next-line react/require-default-props
export default function NavBar({ title }: { title?: string }): JSX.Element {
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  const [navStyle, setNavStyle] = useState({ blur: 0, bgColor: 'transparent' });

  const isInfoPage = checkIsInfoPage();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      const isScrolled = latest > 10;
      setNavStyle({
        blur: isScrolled ? 10 : 0,
        // eslint-disable-next-line no-nested-ternary
        bgColor: isScrolled
          ? theme === 'dark' || theme === 'system'
            ? 'rgba(0, 0, 0, 0.5)'
            : 'rgba(255, 255, 255, 0.5)'
          : 'transparent',
      });
    });
  }, [scrollY, theme]);

  return (
    <motion.nav
      className="fixed top-0 z-[9999] w-full"
      animate={{
        backdropFilter: `blur(${navStyle.blur}px)`,
        backgroundColor: navStyle.bgColor,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {isInfoPage ? (
          <InfoNav title={title || ''} />
        ) : (
          <>
            <NavLink href="/">
              <span className="text-lg font-bold text-primary md:text-2xl">
                Ayoko
              </span>
            </NavLink>
            <div className="hidden items-center space-x-6 md:flex">
              <NavLink href="/catalogue">Catalogue</NavLink>
              <SearchButton />
            </div>
            <SearchButton className="md:hidden" />
          </>
        )}
      </div>
    </motion.nav>
  );
}
