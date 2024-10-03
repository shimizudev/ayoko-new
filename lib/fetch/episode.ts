import { defaultReturn } from '@/app/api/getSource/[id]/route';
import { BASE_URL } from '../constants';
import { safeAwait } from '../promise';
import { EpisodeReturnType } from '@/app/api/getEpisodes/[id]/route';

export interface StreamSource {
  url: string;
  quality: string;
}

export interface Subtitle {
  url: string;
  lang: string;
}

interface IntroOutro {
  start: number;
  end: number;
}

type Headers = unknown;

interface MediaInfo {
  sources: StreamSource[];
  subtitles: Subtitle[];
  audio: unknown[];
  intro: IntroOutro;
  outro: IntroOutro;
  headers: Headers;
}

export const getEpisodes = async (id: string): Promise<EpisodeReturnType[]> => {
  const [response, error] = await safeAwait(
    fetch(`${BASE_URL}/api/getEpisodes/${id}`, { cache: 'no-store' })
  );

  if (error || !response) {
    return [];
  }

  const [data, parseError] = await safeAwait(
    response.json() as Promise<EpisodeReturnType[]>
  );

  if (parseError || !data) {
    return [];
  }

  return data;
};

export const getSources = async (
  id: string,
  episodeId: string,
  number: number,
  provider: string,
  audio: string
): Promise<MediaInfo> => {
  const [response, error] = await safeAwait(
    fetch(
      `${BASE_URL}/api/getSource/${id}?episodeId=${episodeId}&number=${number}&provider=${provider}&audio=${audio}`
    )
  );

  if (error || !response) {
    return defaultReturn;
  }

  const [data, parseError] = await safeAwait(
    response.json() as Promise<MediaInfo>
  );

  if (parseError || !data) {
    return defaultReturn;
  }

  return data;
};
