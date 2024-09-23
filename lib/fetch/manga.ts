import { getSeason } from '../utils';

export interface Manga {
  id: string;
  title: { english: string; romaji: string };
  startDate: { year: number; month: number; day: number };
  description: string;
  coverImage: {
    extraLarge?: string;
    large?: string;
    medium: string;
    color?: string;
  };
  chapters?: number;
  volumes?: number;
}

interface FetchMangaResponse {
  trending: { media: Manga[] };
  popular: { media: Manga[] };
  top10: { media: Manga[] };
  upcomingNextSeason: { media: Manga[] };
  popularThisSeason: { media: Manga[] };
  allTimePopular: { media: Manga[] };
  upcomingNextYear: { media: Manga[] };
}

const query = `
 query FetchManga($nextSeason: MediaSeason, $currentYear: Int, $currentSeason: MediaSeason, $nextYear: Int) {
    trending: Page(page: 1, perPage: 25) {
      media(sort: TRENDING_DESC, type: MANGA, isAdult: false, seasonYear: $currentYear) {
        ...mangaFields
      }
    }
    popular: Page(page: 1, perPage: 25) {
      media(sort: POPULARITY_DESC, type: MANGA, isAdult: false) {
        ...mangaFields
      }
    }
    top10: Page(page: 1, perPage: 10) {
      media(sort: SCORE_DESC, type: MANGA, isAdult: false) {
        ...mangaFields
      }
    }
    upcomingNextSeason: Page(page: 1, perPage: 25) {
      media(season: $nextSeason, type: MANGA, sort: POPULARITY_DESC, isAdult: false) {
        ...mangaFields
      }
    }
    popularThisSeason: Page(page: 1, perPage: 25) {
      media(season: $currentSeason, type: MANGA, sort: POPULARITY_DESC, isAdult: false) {
        ...mangaFields
      }
    }
    allTimePopular: Page(page: 1, perPage: 25) {
      media(sort: POPULARITY_DESC, type: MANGA, isAdult: false) {
        ...mangaFields
      }
    }
    upcomingNextYear: Page(page: 1, perPage: 25) {
      media(seasonYear: $nextYear, type: MANGA, sort: POPULARITY_DESC, isAdult: false) {
        ...mangaFields
      }
    }
    mustRead: Page(page: 1, perPage: 6) {
      media(tag: "Must Read", sort: POPULARITY_DESC, type: MANGA, isAdult: false) {
        ...mangaFields
      }
    }
  }

  fragment mangaFields on Media {
    id
    title {
      english
      romaji
    }
    startDate {
      year
      month
      day
    }
    description
    coverImage {
      extraLarge
      large
      medium
      color
    }
    chapters
    volumes
  }`;

const fetchMangaData = async (): Promise<FetchMangaResponse> => {
  const variables = {
    nextSeason: getSeason(new Date().getMonth() + 1),
    currentSeason: getSeason(new Date().getMonth()),
    nextYear: new Date().getFullYear() + 1,
    currentYear: new Date().getFullYear(),
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();

  return json.data;
};

const cache = new Map<
  string,
  { data: FetchMangaResponse; timestamp: number }
>();

export const getMangaData = async (): Promise<FetchMangaResponse> => {
  const cacheKey = 'mangaData';
  const now = Date.now();

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (now - cached.timestamp < 3_600_000) {
      return cached.data;
    }
  }

  const data = await fetchMangaData();
  cache.set(cacheKey, { data, timestamp: now });
  return data;
};
