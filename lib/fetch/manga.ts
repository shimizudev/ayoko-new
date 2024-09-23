import { ANIFY_URL } from '../constants';
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

interface Media {
  idMal: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  countryOfOrigin: string;
  studios: {
    edges: Array<{
      node: {
        id: number;
        name: string;
        favourites: number;
      };
    }>;
  };
}

interface MediaResponse {
  data: {
    Media: Media;
  };
}

export interface Title {
  native: string | null;
  romaji: string | null;
  english: string | null;
}

interface Mapping {
  id: string;
  providerId: string;
  similarity: number;
  providerType: 'ANIFY' | 'MANGA' | 'META' | 'INFORMATION';
}

interface Rating {
  mal: number | null;
  tvdb: number | null;
  kitsu: number | null;
  anilist: number | null;
  anidb: number | null;
  tmdb: number | null;
  comick: number | null;
  mangadex: number | null;
  novelupdates: number | null;
}

interface Popularity {
  mal: number | null;
  tvdb: number | null;
  kitsu: number | null;
  anilist: number | null;
  anidb: number | null;
  tmdb: number | null;
  comick: number | null;
  mangadex: number | null;
  novelupdates: number | null;
}

interface CoverImage {
  large: string;
}

interface RelationData {
  id: number;
  type: 'ANIFY' | 'MANGA';
  title: {
    userPreferred: string;
  };
  format:
    | 'TV'
    | 'TV_SHORT'
    | 'MOVIE'
    | 'SPECIAL'
    | 'OVA'
    | 'ONA'
    | 'MUSIC'
    | 'MANGA'
    | 'NOVEL'
    | 'ONE_SHOT'
    | 'UNKNOWN';
  status:
    | 'FINISHED'
    | 'RELEASING'
    | 'NOT_YET_RELEASED'
    | 'CANCELLED'
    | 'HIATUS';
  coverImage: CoverImage;
  bannerImage: string | null;
}

interface Relation {
  id: number;
  data: RelationData;
  type:
    | 'ADAPTATION'
    | 'PREQUEL'
    | 'SEQUEL'
    | 'PARENT'
    | 'SIDE_STORY'
    | 'CHARACTER'
    | 'SUMMARY'
    | 'ALTERNATIVE'
    | 'SPIN_OFF'
    | 'OTHER'
    | 'SOURCE'
    | 'COMPILATION'
    | 'CONTAINS';
}

interface Character {
  name: string;
  image: string;
  voiceActor: {
    name: string;
    image: string;
  };
}

interface Chapter {
  id: string;
  title: string;
  number: number;
  rating: number | null;
  updatedAt: number;
  mixdrop: string | null;
}

interface ChapterData {
  chapters: Chapter[];
  providerId: string;
}

interface Chapters {
  latest: {
    updatedAt: number;
    latestTitle: string;
    latestChapter: number;
  };
  data: ChapterData[];
}

interface Artwork {
  img: string;
  type: 'banner' | 'poster' | 'clear_logo' | 'top_banner';
  providerId: string;
}

interface Anify {
  id: string;
  slug: string;
  coverImage: string;
  bannerImage: string;
  trailer: string | null;
  status:
    | 'FINISHED'
    | 'RELEASING'
    | 'NOT_YET_RELEASED'
    | 'CANCELLED'
    | 'HIATUS';
  season: 'SUMMER' | 'FALL' | 'WINTER' | 'SPRING';
  title: Title;
  currentEpisode: number | null;
  mappings: Mapping[];
  synonyms: string[];
  countryOfOrigin: string;
  description: string;
  duration: number | null;
  color: string | null;
  year: number | null;
  rating: Rating;
  popularity: Popularity;
  type: 'ANIFY' | 'MANGA';
  format:
    | 'TV'
    | 'TV_SHORT'
    | 'MOVIE'
    | 'SPECIAL'
    | 'OVA'
    | 'ONA'
    | 'MUSIC'
    | 'MANGA'
    | 'NOVEL'
    | 'ONE_SHOT'
    | 'UNKNOWN';
  relations: Relation[];
  characters: Character[];
  totalEpisodes: number | null;
  totalVolumes: number | null;
  totalChapters: number | null;
  genres: string[];
  tags: string[];
  chapters: Chapters;
  averageRating: number;
  averagePopularity: number;
  artwork: Artwork[];
  relationType: string;
}

export type MangaInfo = Media & Anify;

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

const infoQuery = `
  query ($mediaId: Int) {
  Media(id: $mediaId) {
    idMal
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    countryOfOrigin
    studios(isMain: true) {
      edges {
        node {
          id
          name
          favourites
        }
      }
    }
  }
}`;

const fetchAnilistInfo = async (id: string) => {
  const variables = {
    mediaId: id,
  };

  const response = await fetch(`https://graphql.anilist.co`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: infoQuery, variables }),
  });

  const json = (await response.json()) as MediaResponse;

  return json.data.Media as Media;
};

const fetchAnifyInfo = async (id: string) => {
  const response = await fetch(
    `${ANIFY_URL}/media?id=${id}&providerId=anilist`
  );

  const data = (await response.json()) as Anify;

  return data;
};

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

export const getMangaInfo = async (id: string): Promise<MangaInfo> => {
  const [anify, anilist] = await Promise.all([
    fetchAnifyInfo(id),
    fetchAnilistInfo(id),
  ]);

  const mergedInfo = {
    ...anify,
    ...anilist,
  } as MangaInfo;

  return mergedInfo;
};
