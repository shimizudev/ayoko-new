import { redirect } from 'next/navigation';
import { fetchRedirect } from '@/lib/fetch/redirect';

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<void> {
  const type = await fetchRedirect(params.id);

  if (type === 'ANIME') {
    redirect(`/anime/${params.id}`);
  } else if (type === 'MANGA') {
    redirect(`/manga/${params.id}`);
  } else {
    redirect('/404');
  }
}
