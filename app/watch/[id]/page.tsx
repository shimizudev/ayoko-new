/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EpisodeReturn } from '@/app/api/getEpisodes/[id]/route';
import Player from '@/components/player';
import { getAnimeInfo } from '@/lib/fetch/anime';
import { getSources, getEpisodes } from '@/lib/fetch/episode';

// eslint-disable-next-line max-lines-per-function
export default async function Watch({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { n: number; p: string; a: string };
}): Promise<JSX.Element> {
  const [episodes, info] = await Promise.all([
    getEpisodes(params.id),
    getAnimeInfo(params.id),
  ]);

  let provider: string = 'gogoanime';

  switch (searchParams.p) {
    case '1': {
      provider = 'gogoanime';
      break;
    }
    case '2': {
      provider = 'hianime';
      break;
    }
    case '3': {
      provider = 'animepahe';
      break;
    }
    default: {
      provider = 'gogoanime';
      break;
    }
  }

  const providerEpisode = episodes.find((pr) => pr.providerId === provider);
  // @ts-ignore
  const currentType = providerEpisode?.episodes[
    searchParams.a as string
  ] as EpisodeReturn[];
  const currentEpisode = currentType.find(
    (episode) => Number(searchParams.n) === Number(episode.number)
  );

  const sources = await getSources(
    params.id,
    encodeURIComponent(currentEpisode?.id as string),
    Number(searchParams.n),
    searchParams.p as string,
    searchParams.a as string
  );

  return (
    <div className="mt-10 max-w-4xl">
      <Player
        idMal={String(info.idMal)}
        title={currentEpisode?.title as string}
        episodeId={currentEpisode?.id as string}
        subType={searchParams.a}
        provider={searchParams.p}
        episodeNumber={Number(searchParams.n)}
        id={info.id}
        poster={
          currentEpisode?.thumbnail || info?.bannerImage || info.coverImage
        }
        sources={sources.sources}
        subtitles={sources.subtitles}
      />
    </div>
  );
}
