import { use } from 'react';

import AnimeCarousel from '@/components/home/carousel';
import { getAnimeData } from '@/lib/fetch/anime';
import CardSwiper from '@/components/home/card-swiper';
import { getMangaData } from '../lib/fetch/manga';
import MangaCardSwiper from '@/components/home/manga-card-swiper';

export default function Home(): JSX.Element {
  const anime = use(getAnimeData());
  const manga = use(getMangaData());

  return (
    <div>
      <AnimeCarousel animes={anime.trending.media.slice(0, 5)} />
      <div className="anime-container">
        <div className="mt-4 px-4 py-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 rounded-lg bg-primary" />
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              Trending Now
            </h1>
          </div>
          <CardSwiper animes={anime.trending.media} />
        </div>
        <div className="mt-4 px-4 py-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 rounded-lg bg-primary" />
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              All Time Popular
            </h1>
          </div>
          <CardSwiper animes={anime.popular.media} />
        </div>
      </div>
      <div className="manga-container">
        <div className="mt-4 px-4 py-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 rounded-lg bg-primary" />
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              Best Manga
            </h1>
          </div>
          <MangaCardSwiper mangas={manga.top10.media} />
        </div>
        <div className="mt-4 px-4 py-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 rounded-lg bg-primary" />
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              All Time Popular Manga
            </h1>
          </div>
          <MangaCardSwiper mangas={manga.popular.media} />
        </div>
      </div>
    </div>
  );
}
