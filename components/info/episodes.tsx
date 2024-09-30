'use client';

import { useState, useEffect } from 'react';
import { EpisodeReturnType } from '@/app/api/getEpisodes/[id]/route';
import EpisodeCard from '../cards/episode-card';
import useMounted from '@/hooks/use-mounted';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';

function getFilteredProviders(episodes: EpisodeReturnType[]) {
  return episodes.filter(
    (provider) =>
      provider.episodes.sub.length > 0 || provider.episodes.dub.length > 0
  );
}

function getCurrentEpisodes(
  filteredProviders: EpisodeReturnType[],
  selectedProvider: string,
  audioType: 'sub' | 'dub'
) {
  return (
    filteredProviders.find((ep) => ep.providerId === selectedProvider)
      ?.episodes[audioType] || []
  );
}

function getFilteredEpisodes(currentEpisodes: any[], searchQuery: string) {
  return currentEpisodes.filter(
    (episode) =>
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.number.toString().includes(searchQuery)
  );
}

function validateSelectedProvider(
  filteredProviders: EpisodeReturnType[],
  selectedProvider: string,
  setSelectedProvider: React.Dispatch<React.SetStateAction<string>>
) {
  if (
    !filteredProviders.some(
      (provider) => provider.providerId === selectedProvider
    )
  ) {
    setSelectedProvider(filteredProviders[0]?.providerId || '');
  }
}

type SelectType = {
  selectedProvider: string;
  filteredProviders: EpisodeReturnType[];
  handleProviderChange: (value: string) => void;
  audioType: 'sub' | 'dub';
  handleAudioTypeChange: (value: 'sub' | 'dub') => void;
  searchQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function Selects({
  selectedProvider,
  filteredProviders,
  handleProviderChange,
  audioType,
  handleAudioTypeChange,
  searchQuery,
  handleSearchChange,
}: SelectType) {
  return (
    <div className="flex gap-4">
      <Select value={selectedProvider} onValueChange={handleProviderChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue>{selectedProvider}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filteredProviders.map((provider) => (
              <SelectItem key={provider.providerId} value={provider.providerId}>
                {provider.providerId}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={audioType} onValueChange={handleAudioTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue>{audioType}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="sub">Sub</SelectItem>
            <SelectItem value="dub">Dub</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="title or number"
      />
    </div>
  );
}

function Header({
  selectedProvider,
  filteredProviders,
  handleProviderChange,
  audioType,
  handleAudioTypeChange,
  searchQuery,
  handleSearchChange,
}: SelectType) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
      <h1 className="text-2xl font-bold">Stream Episodes</h1>
      <Selects
        selectedProvider={selectedProvider}
        filteredProviders={filteredProviders}
        handleProviderChange={handleProviderChange}
        audioType={audioType}
        handleAudioTypeChange={handleAudioTypeChange}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />
    </div>
  );
}

function EpisodesList({
  filteredEpisodes,
  audioType,
  selectedProvider,
  id,
}: {
  filteredEpisodes: any[];
  audioType: string;
  selectedProvider: string;
  id: string;
}) {
  return filteredEpisodes.length === 0 ? (
    <p>No episodes found</p>
  ) : (
    <div className="flex flex-col gap-2">
      {filteredEpisodes.map((episode) => (
        <EpisodeCard
          key={episode.id}
          title={episode.title}
          thumbnail={episode.thumbnail}
          description={episode.description}
          released={episode.released}
          number={episode.number}
          rating={String(episode.rating)}
          isFiller={episode.isFiller}
          id={id}
          duration={episode.duration}
          audio={audioType}
          provider={selectedProvider}
        />
      ))}
    </div>
  );
}

export default function Episodes({
  episodes,
  id,
}: {
  id: string;
  episodes: EpisodeReturnType[];
}): JSX.Element | null {
  const isMounted = useMounted();

  const filteredProviders = getFilteredProviders(episodes);
  const [selectedProvider, setSelectedProvider] = useState<string>(
    filteredProviders[0]?.providerId || ''
  );
  const [audioType, setAudioType] = useState<'sub' | 'dub'>('sub');
  const [searchQuery, setSearchQuery] = useState('');

  const currentEpisodes = getCurrentEpisodes(
    filteredProviders,
    selectedProvider,
    audioType
  );
  const filteredEpisodes = getFilteredEpisodes(currentEpisodes, searchQuery);

  useEffect(() => {
    validateSelectedProvider(
      filteredProviders,
      selectedProvider,
      setSelectedProvider
    );
  }, [filteredProviders, selectedProvider]);

  if (!isMounted) return null;

  return (
    <>
      <Header
        selectedProvider={selectedProvider}
        filteredProviders={filteredProviders}
        handleProviderChange={setSelectedProvider}
        audioType={audioType}
        handleAudioTypeChange={setAudioType}
        searchQuery={searchQuery}
        handleSearchChange={(event) => setSearchQuery(event.target.value)}
      />
      <EpisodesList
        filteredEpisodes={filteredEpisodes}
        audioType={audioType}
        selectedProvider={selectedProvider}
        id={id}
      />
    </>
  );
}
