import { use } from 'react';

import AnimeCarousel from '@/components/home/carousel';
import { getAnimeData } from '@/lib/fetch/anime';

export default function Home(): JSX.Element {
  const anime = use(getAnimeData());

  return (
    <div>
      <AnimeCarousel animes={anime.trending.media.slice(0, 5)} />
    </div>
  );
}
