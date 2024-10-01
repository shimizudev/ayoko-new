'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type EpisodeProps = {
  title: string;
  thumbnail: string;
  description: string;
  released: string;
  number: number;
  rating: string;
  isFiller: boolean;
  id: string;
  duration: number;
  provider: string;
  audio: string;
};

function EpisodeDuration({
  duration,
  released,
}: {
  duration: number;
  released: string;
}) {
  return (
    <div className="mb-2 flex items-center text-xs text-muted-foreground sm:text-sm">
      <span className="mr-2">{duration}m</span>
      <span className="mr-2">•</span>
      <span>{released}</span>
    </div>
  );
}

function EpisodeDetails({
  title,
  description,
  released,
  number,
  rating,
  isFiller,
  duration,
  provider,
  audio,
}: Omit<EpisodeProps, 'thumbnail' | 'id'>) {
  return (
    <div className="flex flex-grow flex-col justify-between p-2 sm:p-4">
      <div>
        <h3 className="mb-1 text-sm font-semibold sm:text-lg">
          {number}. {title}
        </h3>
        <p className="mb-2 line-clamp-2 text-xs text-muted-foreground sm:line-clamp-3">
          {description}
        </p>
        <EpisodeDuration released={released} duration={duration} />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        <Badge variant="secondary">{rating}</Badge>
        {isFiller && <Badge variant="outline">Filler</Badge>}
        <span className="text-muted-foreground">{provider}</span>
        <span className="text-muted-foreground">{audio}</span>
      </div>
    </div>
  );
}

const cardVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  hover: {
    scale: 0.98,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
  hidden: { opacity: 0, y: 20 },
};

// eslint-disable-next-line max-lines-per-function
export default function EpisodeCard({
  title,
  thumbnail,
  description,
  released,
  number,
  rating,
  isFiller,
  id,
  duration,
  provider,
  audio,
}: EpisodeProps): JSX.Element {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? 'visible' : 'hidden'}
      initial="hidden"
      variants={cardVariants}
      whileHover="hover"
      className="flex w-full overflow-hidden rounded-lg bg-muted text-card-foreground shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <Link
        // eslint-disable-next-line no-nested-ternary
        href={`/watch/${id}?n=${number}&a=${audio}&p=${provider === 'gogoanime' ? '1' : provider === 'hianime' ? '2' : '3'}`}
        className="flex w-full"
      >
        <div className="w-1/3 flex-shrink-0 sm:w-[20%]">
          <Image
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
            width={300}
            height={200}
          />
        </div>
        <EpisodeDetails
          title={title}
          description={description}
          released={released}
          number={number}
          rating={rating}
          isFiller={isFiller}
          duration={duration}
          provider={provider}
          audio={audio}
        />
      </Link>
    </motion.div>
  );
}
