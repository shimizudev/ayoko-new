import AnimeInfoContainer from '@/components/info/container';
import { getAnimeInfo } from '@/lib/fetch/anime';
import { getEpisodes } from '@/lib/fetch/episode';

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const anime = await getAnimeInfo(params.id);
  const episodes = await getEpisodes(params.id);

  return <AnimeInfoContainer anime={anime} episodes={episodes} />;
}
