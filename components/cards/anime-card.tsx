'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { Anime } from '@/lib/fetch/anime';

export default function AnimeCard({ anime }: { anime: Anime }): JSX.Element {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const cardVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    hidden: { opacity: 0, y: 20 },
  };

  return (
    <Link href={`/anime/${anime.id}`} className="group relative z-10">
      <motion.div
        ref={ref}
        animate={isInView ? 'visible' : 'hidden'}
        initial="hidden"
        variants={cardVariants}
        whileHover="hover"
      >
        <Image
          src={anime.coverImage.large || anime.coverImage.medium}
          alt={anime.title.english || anime.title.romaji}
          width={2000}
          height={2000}
          className="max-h-56 min-h-56 min-w-40 max-w-40 rounded-sm object-cover object-center transition-all duration-150 group-hover:-translate-y-1"
        />
        <h2 className="max-w-40 truncate text-sm font-medium text-foreground/80 group-hover:text-primary">
          {anime.title.english || anime.title.romaji}
        </h2>
      </motion.div>
    </Link>
  );
}
