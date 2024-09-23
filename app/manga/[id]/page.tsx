import MangaInfoContainer from '@/components/info/manga-container';
import { getMangaInfo } from '@/lib/fetch/manga';

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const manga = await getMangaInfo(params.id);
  return <MangaInfoContainer manga={manga} />;
}
