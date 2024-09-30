import { ANIFY_URL } from '../constants';
import { getSeason } from '../utils';
import Cache from '../cache';

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

interface Episode {
  id: string;
  img: string | null;
  title: string;
  hasDub: boolean;
  description: string | null;
  rating: number | null;
  number: number;
  isFiller: boolean;
  updatedAt: number;
}

interface EpisodeData {
  episodes: Episode[];
  providerId: string;
}

interface Episodes {
  latest: {
    updatedAt: number;
    latestTitle: string;
    latestEpisode: number;
  };
  data: EpisodeData[];
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
  episodes: Episodes;
  chapters: Chapters;
  averageRating: number;
  averagePopularity: number;
  artwork: Artwork[];
  relationType: string;
}

export type AnimeInfo = Media & Anify;

const query = `
 query FetchAnime($nextSeason: MediaSeason, $currentYear: Int, $currentSeason: MediaSeason, $nextYear: Int) {
    trending: Page(page: 1, perPage: 25) {
      media(sort: TRENDING_DESC, type: ANIME, isAdult: false, seasonYear: $currentYear) {
        ...animeFields
      }
    }
    popular: Page(page: 1, perPage: 25) {
      media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
        ...animeFields
      }
    }
    top10: Page(page: 1, perPage: 10) {
      media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
        ...animeFields
      }
    }
    upcomingNextSeason: Page(page: 1, perPage: 25) {
      media(season: $nextSeason, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...animeFields
      }
    }
    popularThisSeason: Page(page: 1, perPage: 25) {
      media(season: $currentSeason, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...animeFields
      }
    }
    allTimePopularMovies: Page(page: 1, perPage: 25) {
      media(sort: POPULARITY_DESC, type: ANIME, format: MOVIE, isAdult: false) {
        ...animeFields
      }
    }
    upcomingNextYear: Page(page: 1, perPage: 25) {
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

const cacheInfo = new Cache<string, AnimeInfo>(60 * 60 * 1000);

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
    cache: 'no-store',
  });
  const json = await response.json();

  return json.data;
};

const cache = new Map<
  string,
  { data: FetchAnimeResponse; timestamp: number }
>();

const anilistInfoCache = new Cache<string, MediaResponse>(60 * 60 * 1000);

const fetchAnilistInfo = async (id: string) => {
  const cachedData = anilistInfoCache.get(id);

  if (cachedData) {
    return cachedData;
  }

  const variables = {
    mediaId: id,
  };

  const response = await fetch(`https://graphql.anilist.co`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: infoQuery, variables }),
    cache: 'no-store',
  });

  const json = (await response.json()) as MediaResponse;

  anilistInfoCache.set(id, json);

  return json.data.Media as Media;
};

const anifyInfoCache = new Cache<string, Anify>(60 * 60 * 1000);

const fetchAnifyInfo = async (id: string) => {
  const cachedData = anifyInfoCache.get(id);

  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(`${ANIFY_URL}/info/${id}`, {
    cache: 'no-store',
  });

  const data = (await response.json()) as Anify;

  anifyInfoCache.set(id, data);

  return data;
};

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

export const getAnimeInfo = async (id: string): Promise<AnimeInfo> => {
  const cachedInfo = cacheInfo.get(id);

  if (cachedInfo) {
    return cachedInfo;
  }

  const [anify, anilist] = await Promise.all([
    fetchAnifyInfo(id),
    fetchAnilistInfo(id),
  ]);

  const mergedInfo = {
    ...anify,
    ...anilist,
  } as AnimeInfo;

  cacheInfo.set(id, mergedInfo);

  return mergedInfo;
};
