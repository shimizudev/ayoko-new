'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
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
import { getEpisodes } from '@/lib/fetch/episode';

function getFilteredProviders(episodes: EpisodeReturnType[]) {
  return episodes.filter(
    (provider) =>
      provider.episodes.sub.length > 0 || provider.episodes.dub.length > 0
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

function EpisodesList({
  filteredEpisodes,
  audioType,
  selectedProvider,
  id,
}: EpisodesListProps) {
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

function Header({
  selectedProvider,
  filteredProviders,
  handleProviderChange,
  audioType,
  handleAudioTypeChange,
  searchQuery,
  handleSearchChange,
  refetch,
}: HeaderProps) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Stream Episodes</h1>
        <button type="button" onClick={refetch}>
          <RefreshCw className="h-5 w-5 text-blue-500 hover:text-blue-700" />
        </button>
      </div>
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

// eslint-disable-next-line max-lines-per-function
export default function Episodes({ id }: { id: string }): JSX.Element | null {
  const isMounted = useMounted();
  const {
    data: episodes,
    isLoading,
    isError,
    isFetching,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['episodes', id],
    queryFn: ({ queryKey }) => getEpisodes(queryKey[1] as string),
  });

  const filteredProviders = getFilteredProviders(episodes || []);
  const [selectedProvider, setSelectedProvider] = useState<string>(
    filteredProviders[0]?.providerId || ''
  );
  const [audioType, setAudioType] = useState<'sub' | 'dub'>('sub');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    validateSelectedProvider(
      filteredProviders,
      selectedProvider,
      setSelectedProvider
    );
  }, [filteredProviders, selectedProvider]);

  const currentEpisodes =
    filteredProviders.find((ep) => ep.providerId === selectedProvider)
      ?.episodes[audioType] || [];
  const filteredEpisodes = currentEpisodes.filter(
    (episode) =>
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.number.toString().includes(searchQuery)
  );

  if (!isMounted) return null;

  if (isError) return <p>Error loading episodes. Please try again.</p>;
  if (isLoading || isFetching || isPending) return <p>Loading episodes...</p>;

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
        refetch={refetch}
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

type SelectType = {
  selectedProvider: string;
  filteredProviders: EpisodeReturnType[];
  handleProviderChange: (value: string) => void;
  audioType: 'sub' | 'dub';
  handleAudioTypeChange: (value: 'sub' | 'dub') => void;
  searchQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type EpisodesListProps = {
  filteredEpisodes: any[];
  audioType: string;
  selectedProvider: string;
  id: string;
};

type HeaderProps = SelectType & { refetch: () => void };
