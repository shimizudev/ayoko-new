import { getSeason } from '../utils';

export interface Anime {
  id: string;
  studios: { nodes: { name: string }[] };
  title: { english: string; romaji: string };
  startDate: { year: number; month: number; day: number };
  description: string;
  bannerImage: string;
  coverImage: {
    extraLarge?: string;
    large?: string;
    medium: string;
    color?: string;
  };
  trailer: { id: string } | null;
}

interface FetchAnimeResponse {
  trending: { media: Anime[] };
  popular: { media: Anime[] };
  top10: { media: Anime[] };
  upcomingNextSeason: { media: Anime[] };
  popularThisSeason: { media: Anime[] };
  allTimePopularMovies: { media: Anime[] };
  upcomingNextYear: { media: Anime[] };
}

const query = `
 query FetchAnime($nextSeason: MediaSeason, $currentYear: Int, $currentSeason: MediaSeason, $nextYear: Int) {
    trending: Page(page: 1, perPage: 6) {
      media(sort: TRENDING_DESC, type: ANIME, isAdult: false, seasonYear: $currentYear) {
        ...animeFields
      }
    }
    popular: Page(page: 1, perPage: 6) {
      media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
        ...animeFields
      }
    }
    top10: Page(page: 1, perPage: 10) {
      media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
        ...animeFields
      }
    }
    upcomingNextSeason: Page(page: 1, perPage: 6) {
      media(season: $nextSeason, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...animeFields
      }
    }
    popularThisSeason: Page(page: 1, perPage: 6) {
      media(season: $currentSeason, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...animeFields
      }
    }
    allTimePopularMovies: Page(page: 1, perPage: 6) {
      media(sort: POPULARITY_DESC, type: ANIME, format: MOVIE, isAdult: false) {
        ...animeFields
      }
    }
    upcomingNextYear: Page(page: 1, perPage: 6) {
      media(seasonYear: $nextYear, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...animeFields
      }
    }
    mustWatch: Page(page: 1, perPage: 6) {
      media(tag: "Must Watch", sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
        ...animeFields
      }
    }
  }

  fragment animeFields on Media {
    id
    studios {
      nodes {
        name
      }
    }
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
    bannerImage
    coverImage {
      extraLarge
      large
      medium
      color
    }
    trailer {
      id
    }
  }`;

const fetchAnimeData = async (): Promise<FetchAnimeResponse> => {
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
  { data: FetchAnimeResponse; timestamp: number }
>();

export const getAnimeData = async (): Promise<FetchAnimeResponse> => {
  const cacheKey = 'animeData';
  const now = Date.now();

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (now - cached.timestamp < 3_600_000) {
      return cached.data;
    }
  }

  const data = await fetchAnimeData();
  cache.set(cacheKey, { data, timestamp: now });
  return data;
};
