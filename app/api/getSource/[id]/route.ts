import { NextRequest, NextResponse } from 'next/server';
import { ANIME, StreamingServers } from '@consumet/extensions';
import { ANIFY_URL } from '@/lib/constants';
import { safeAwait } from '@/lib/promise';

export const revalidate = 0;

export const defaultReturn = {
  sources: [],
  subtitles: [],
  audio: [],
  intro: {
    start: 0,
    end: 0,
  },
  outro: {
    start: 0,
    end: 0,
  },
  headers: {},
};

async function getAnimepaheSource(
  id: string,
  episodeId: string,
  number: number,
  audio: string
) {
  const [res, err] = await safeAwait(
    fetch(
      `${ANIFY_URL}/sources?providerId=animepahe&episodeNumber=${number}&subType=${audio}&id=${id}&watchId=${episodeId}`
    )
  );

  if (err || !res) {
    return defaultReturn;
  }

  const [parsedRes, parsingErr] = await safeAwait(res.json());

  if (parsingErr || !parsedRes) {
    return defaultReturn;
  }

  return parsedRes;
}

async function getGogoAnimeSource(id: string) {
  const gogo = new ANIME.Gogoanime('anitaku.pe');

  const [source, error] = await safeAwait(
    gogo.fetchEpisodeSources(id, StreamingServers.GogoCDN)
  );

  if (error || !source) {
    return defaultReturn;
  }

  return {
    sources: source.sources.map((src) => ({
      url: src.url,
      quality: src.quality,
    })),
    subtitles:
      source.subtitles?.map((sub) => ({
        url: sub.url,
        lang: sub.lang,
      })) || [],
    audio: [],
    intro: {
      start: 0,
      end: 0,
    },
    outro: {
      start: 0,
      end: 0,
    },
    headers: {},
  };
}

async function getHiAnimeSource(
  episodeId: string,
  audio: string,
  id: string,
  number: number
) {
  const [res, err] = await safeAwait(
    fetch(
      `${ANIFY_URL}/sources?id=${id}&episodeNumber=${number}&subType=${audio}&watchId=${encodeURIComponent(`/watch/${episodeId}`)}&providerId=zoro`
    )
  );

  if (err || !res) {
    return defaultReturn;
  }

  const [parsedRes, parsingErr] = await safeAwait(res.json());

  if (parsingErr || !parsedRes) {
    return defaultReturn;
  }

  return parsedRes;
}

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<any> => {
  const reqUrl = new URL(req.url);

  const { searchParams } = reqUrl;

  const episodeId = searchParams.get('episodeId');
  const number = searchParams.get('number');
  const audio = searchParams.get('audio');
  const provider = searchParams.get('provider');

  if (provider === '1') {
    const [sources, err] = await safeAwait(getGogoAnimeSource(episodeId!));

    if (!sources || err) {
      return NextResponse.json(defaultReturn);
    }

    return NextResponse.json(sources);
  }
  if (provider === '2') {
    const [sources, err] = await safeAwait(
      getHiAnimeSource(episodeId!, audio!, params.id!, Number(number))
    );

    if (!sources || err) {
      return NextResponse.json(defaultReturn);
    }

    return NextResponse.json(sources);
  }

  const [sources, err] = await safeAwait(
    getAnimepaheSource(params.id, episodeId!, Number(number)!, audio || 'sub'!)
  );

  if (!sources || err) {
    return NextResponse.json(defaultReturn);
  }

  return NextResponse.json(sources);
};
