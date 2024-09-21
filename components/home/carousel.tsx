'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Anime } from '@/lib/fetch/anime';
import useMounted from '@/hooks/use-mounted';
import { Skeleton } from '../ui/skeleton';

function cleanDescription(input: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  return doc.body.textContent || '';
}

async function fetchTrailer(id: string): Promise<string> {
  const data = await fetch(`/api/yt?id=${id}`);
  const json = await data.json();
  return json.url;
}

function useAutoPlay(
  animes: Anime[],
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) {
  const intervalRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    const autoPlay = () => {
      progressRef.current += 1 / 200;

      if (progressRef.current >= 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % animes.length);
        progressRef.current = 0;
      }

      setProgress(progressRef.current);
    };

    intervalRef.current = window.setInterval(autoPlay, 100);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [animes.length, setCurrentIndex, setProgress]);

  return () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  };
}

function useCarouselNavigation(
  animes: Anime[],
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) {
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % animes.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + animes.length) % animes.length
    );
    setProgress(0);
  };

  return { nextSlide, prevSlide };
}

function RenderSkeleton() {
  return (
    <div className="relative max-h-[700px] min-h-[500px] w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-between p-8">
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="hidden h-96 w-64 lg:block">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function RenderImage({ currentAnime }: { currentAnime: Anime }): JSX.Element {
  return (
    <Image
      src={
        currentAnime.bannerImage ??
        (currentAnime.coverImage.extraLarge ||
          currentAnime.coverImage.large ||
          currentAnime.coverImage.medium)
      }
      alt={currentAnime.title.english || currentAnime.title.romaji}
      layout="fill"
      objectFit="cover"
      className="brightness-50"
    />
  );
}

function VideoDisplay({
  currentAnime,
  isMuted,
}: {
  currentAnime: Anime;
  isMuted: boolean;
}) {
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function loadTrailer() {
      if (currentAnime.trailer && currentAnime.trailer.id) {
        const url = await fetchTrailer(currentAnime.trailer.id);
        setTrailerUrl(url);
      }
    }
    loadTrailer();
  }, [currentAnime]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.5; // Set volume to half
    }
  }, [trailerUrl]);

  if (trailerUrl) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        ref={videoRef}
        src={trailerUrl}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted={isMuted}
        playsInline
      />
    );
  }

  return <RenderImage currentAnime={currentAnime} />;
}

function AnimeButtons({
  isMuted,
  toggleMute,
}: {
  isMuted: boolean;
  toggleMute: () => void;
}) {
  return (
    <div className="flex items-center space-x-4">
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
        WATCH NOW
      </Button>
      <Button
        variant="ghost"
        onClick={toggleMute}
        size="icon"
        className="rounded-full"
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}

function AnimeImage({ currentAnime }: { currentAnime: Anime }) {
  return (
    <div className="relative hidden h-96 w-64 lg:block">
      <Image
        src={
          currentAnime.coverImage.extraLarge ||
          currentAnime.coverImage.large ||
          currentAnime.coverImage.medium
        }
        alt={currentAnime.title.english || currentAnime.title.romaji}
        layout="fill"
        objectFit="cover"
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}

function AnimeInfo({
  currentAnime,
  isMuted,
  toggleMute,
}: {
  currentAnime: Anime;
  isMuted: boolean;
  toggleMute: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-between p-8">
      <div className="max-w-2xl text-white">
        <h2 className="mb-2 text-2xl font-bold md:text-4xl">
          {currentAnime.title.english || currentAnime.title.romaji}
        </h2>
        <p className="mb-4 text-sm">
          {currentAnime.studios.nodes
            .map((studio) => studio.name)
            .slice(0, 2)
            .join(', ')}{' '}
          | {currentAnime.startDate.year}
        </p>
        <p className="mb-6 line-clamp-2 text-sm">
          {cleanDescription(currentAnime.description)}
        </p>
        <AnimeButtons isMuted={isMuted} toggleMute={toggleMute} />
      </div>
      <AnimeImage currentAnime={currentAnime} />
    </div>
  );
}

function NavigationButtons({ prevSlide, nextSlide }: any) {
  return (
    <div className="absolute bottom-2 right-8 flex space-x-4">
      <Button
        variant="ghost"
        onClick={prevSlide}
        size="icon"
        className="rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        onClick={nextSlide}
        size="icon"
        className="rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}

function LinesIndicator({
  animes,
  currentIndex,
  progress,
}: {
  animes: Anime[];
  currentIndex: number;
  progress: number;
}) {
  return (
    <div className="absolute bottom-4 left-28 flex -translate-x-1/2 transform space-x-2 md:left-40">
      {animes.map((_, index) => (
        <motion.div
          key={_.id}
          className="h-1 overflow-hidden rounded"
          initial={{ width: '20px' }}
          animate={{
            width: index === currentIndex ? '30px' : '20px',
            backgroundColor:
              index === currentIndex
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(255, 255, 255, 0.70)',
          }}
          transition={{ duration: 0.3 }}
        >
          {index === currentIndex && (
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function AnimeCarousel({
  animes,
}: {
  animes: Anime[];
}): JSX.Element | null {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const isMounted = useMounted();

  const currentAnime = animes[currentIndex];

  const { nextSlide, prevSlide } = useCarouselNavigation(
    animes,
    setCurrentIndex,
    setProgress
  );

  useAutoPlay(animes, currentIndex, setCurrentIndex, setProgress);

  const toggleMute = () => setIsMuted(!isMuted);

  if (!isMounted || !animes || animes.length === 0) return <RenderSkeleton />;

  return (
    <div className="relative max-h-[700px] min-h-[500px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAnime.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <VideoDisplay currentAnime={currentAnime} isMuted={isMuted} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <AnimeInfo
            currentAnime={currentAnime}
            isMuted={isMuted}
            toggleMute={toggleMute}
          />
        </motion.div>
      </AnimatePresence>
      <LinesIndicator
        animes={animes}
        currentIndex={currentIndex}
        progress={progress}
      />
      <NavigationButtons prevSlide={prevSlide} nextSlide={nextSlide} />
    </div>
  );
}
