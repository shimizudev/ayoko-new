'use client';

import { SwiperSlide } from 'swiper/react';
import { Manga } from '@/lib/fetch/manga';
import MangaCard from '../cards/manga-card';
import DraggableScrollContainer from '../cards/draggable-scroll-container';

export default function MangaCardSwiper({
  mangas,
}: {
  mangas: Manga[];
}): JSX.Element {
  return (
    <DraggableScrollContainer>
      {mangas.map((manga) => (
        <SwiperSlide key={manga.id}>
          <MangaCard manga={manga} />
        </SwiperSlide>
      ))}
    </DraggableScrollContainer>
  );
}
