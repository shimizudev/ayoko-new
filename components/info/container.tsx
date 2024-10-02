/* eslint-disable @next/next/no-img-element */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimeInfo, Title } from '@/lib/fetch/anime';
import { getMonthName } from '@/lib/utils';
import Episodes from './episodes';
import { safeDestructure } from '@/lib/obj';

interface AnimeInfoProps {
  anime: AnimeInfo;
}

function AnimeBanner({
  bannerImage,
  title,
}: {
  bannerImage: string;
  title: Title;
}): JSX.Element {
  return (
    <motion.div
      className="relative h-48 sm:h-64 md:h-80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <img
        src={bannerImage}
        alt={title.english || title.romaji || ''}
        className="absolute left-0 top-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </motion.div>
  );
}

// eslint-disable-next-line max-lines-per-function
function AnimeHeader({
  coverImage,
  title,
  season,
  year,
  format,
  status,
  day,
  month,
}: {
  coverImage: string;
  title: Title;
  season: string;
  year: number;
  format: string;
  status: string;
  day: number;
  month: number;
}): JSX.Element {
  return (
    <motion.div
      className="flex flex-col items-center space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <img
        src={coverImage}
        alt={title.english || title.romaji || ''}
        className="h-52 w-36 rounded-lg object-cover shadow-md sm:h-[268px] sm:w-48"
      />
      <div className="flex-1 text-center sm:text-left">
        <h2>
          {day} {getMonthName(month)} {year}
        </h2>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
          {title.english || title.romaji}
        </h1>
        <p className="mb-2 text-sm text-primary/85">{title.romaji}</p>
        <div className="mb-2 flex flex-wrap justify-center gap-2 sm:justify-start">
          <Badge className="rounded">
            {season} {year}
          </Badge>
          <Badge variant="secondary" className="rounded">
            {format}
          </Badge>
          <Badge variant="outline" className="rounded">
            {status}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}

function AnimeDetails({
  description,
  averageRating,
  totalEpisodes,
}: {
  description: string;
  averageRating: number;
  totalEpisodes: number;
}): JSX.Element {
  const formatRating = (rating: number) => Math.round(rating);

  return (
    <motion.div
      className="mt-4 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <p className="line-clamp-3 text-sm text-gray-300">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
        <div className="flex items-center">
          <svg
            className="mr-1 h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-bold">{formatRating(averageRating)}</span>
        </div>
        <div className="text-sm">
          <span className="font-semibold">{totalEpisodes}</span> episodes
        </div>
      </div>
    </motion.div>
  );
}

function AnimeActions() {
  return (
    <motion.div
      className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <Button className="w-full sm:w-auto">Watch Now</Button>
      <Button variant="secondary" className="w-full sm:w-auto">
        + Add to List
      </Button>
    </motion.div>
  );
}

export default function AnimeInfoContainer({
  anime,
}: AnimeInfoProps): JSX.Element {
  const {
    title,
    coverImage,
    bannerImage,
    season,
    year,
    format,
    status,
    description,
    totalEpisodes,
    averageRating,
    relations,
    startDate,
  } = safeDestructure(anime);

  const { month, day } = safeDestructure(startDate);

  return (
    <motion.div
      className="relative mx-auto w-full overflow-hidden bg-background text-foreground shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <AnimeBanner bannerImage={bannerImage} title={title} />
      <div className="relative -mt-24 px-4 py-4 sm:-mt-44 sm:px-6">
        <AnimeHeader
          coverImage={coverImage}
          title={title}
          season={season}
          year={year!}
          format={format}
          status={status}
          day={day}
          month={month}
        />
        <AnimeDetails
          description={description}
          averageRating={averageRating}
          totalEpisodes={totalEpisodes!}
        />
        <AnimeActions />
        {relations && relations.length > 0 && <div className="mt-6" />}
        <Episodes id={anime.id} banner={bannerImage} cover={coverImage} />
      </div>
    </motion.div>
  );
}
