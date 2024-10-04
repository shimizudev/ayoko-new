import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { atomWithStore } from 'jotai-zustand';
import { createStore } from 'zustand/vanilla';
import useMounted from './use-mounted';

export interface VideoProgressData {
  title: string;
  timeWatched: number;
  duration: number;
  provider: string;
  poster: string;
  episodeNumber: number;
  subType: string;
  episodeId: string;
}

export interface VideoProgressState {
  [key: string]: VideoProgressData;
}

const videoProgressStore = createStore<VideoProgressState>(() => ({}));
const videoProgressAtom = atomWithStore(videoProgressStore);

type VideoProgress = {
  getVideoProgress: (id: string) => VideoProgressData;
  updateVideoProgress: (id: string, data: VideoProgressData) => void;
};

const useVideoProgress = (): VideoProgress => {
  const [videoProgress, setVideoProgress] = useAtom(videoProgressAtom);
  const isSSR = useMounted();
  const [storedProgress, setStoredProgress] = useLocalStorage<
    Record<string, VideoProgressData>
  >('vidstack_settings', {});

  useEffect(() => {
    if (isSSR && storedProgress) {
      setVideoProgress(storedProgress);
    }
  }, [isSSR, storedProgress, setVideoProgress]);

  const getVideoProgress = (id: string) => videoProgress[id];

  const updateVideoProgress = (id: string, data: VideoProgressData) => {
    const updatedProgress = { ...videoProgress, [id]: data };

    setVideoProgress(updatedProgress);
    setStoredProgress(updatedProgress);
  };

  return { getVideoProgress, updateVideoProgress };
};

export default useVideoProgress;
