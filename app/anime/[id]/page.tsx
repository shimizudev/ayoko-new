import AnimeInfoContainer from '@/components/info/container';
import { getAnimeInfo } from '@/lib/fetch/anime';

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const anime = await getAnimeInfo(params.id);

  return <AnimeInfoContainer anime={anime} />;
}
