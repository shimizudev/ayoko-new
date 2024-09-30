import { BASE_URL } from '../constants';
import { safeAwait } from '../promise';
import { EpisodeReturnType } from '@/app/api/getEpisodes/[id]/route';

export const getEpisodes = async (id: string): Promise<EpisodeReturnType[]> => {
  const [response, error] = await safeAwait(
    fetch(`${BASE_URL}/api/getEpisodes/${id}`)
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
