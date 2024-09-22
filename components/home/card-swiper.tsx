'use client';

import { SwiperSlide } from 'swiper/react';
import { Anime } from '@/lib/fetch/anime';
import AnimeCard from '../cards/anime-card';
import DraggableScrollContainer from '../cards/draggable-scroll-container';

export default function CardSwiper({
  animes,
}: {
  animes: Anime[];
}): JSX.Element {
  return (
    <DraggableScrollContainer>
      {animes.map((anime) => (
        <SwiperSlide key={anime.id}>
          <AnimeCard anime={anime} />
        </SwiperSlide>
      ))}
    </DraggableScrollContainer>
  );
}
