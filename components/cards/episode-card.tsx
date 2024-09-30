'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex w-full overflow-hidden rounded-lg bg-muted text-card-foreground shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <Link
        href={`/watch/${id}?n=${number}&a=${audio}&p=${provider}`}
        className="flex w-full"
      >
        <div className="w-1/3 flex-shrink-0 sm:w-1/4">
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
