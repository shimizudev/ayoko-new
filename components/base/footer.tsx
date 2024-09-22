import Link from 'next/link';
import { Separator } from '../ui/separator';
import DiscordIcon from '../icons/discord';
import GithubIcon from '../icons/github';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '../ui/button';

function DevAotoLink(): JSX.Element {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <a
            href="https://sohom829.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="-ml-4 font-normal text-primary hover:underline"
          >
            devaoto
          </a>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/94981761?v=4" />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@devaoto</h4>
            <p className="text-sm">
              The guy who designed and developed{' '}
              <a href="https://www.ayoko.fun">Ayoko</a>
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">He/Him</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-background-400 px-4 py-6">
      <Separator />
      <div className="container mx-auto flex flex-col items-center space-y-4 py-4 md:flex-row md:space-x-6 md:space-y-0">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-2xl font-bold text-primary">Ayoko</h1>
          <p>Watch Anime For Free</p>
        </div>
        <Separator
          orientation="vertical"
          className="hidden h-12 w-px md:block"
        />
        <div className="max-w-xl text-center md:text-left">
          This site does not store any files on our server; we are linked to
          media hosted on 3rd party services.
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <p className="text-center text-xs md:text-left md:text-sm">
          &copy; {new Date().getFullYear()} Ayoko | Developed by <DevAotoLink />
        </p>
        <div className="flex space-x-4">
          <Link
            href="https://github.com/devaoto"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon fontSize={24} />
          </Link>
          <Link
            href="https://discord.gg/EPsdQM5Hzh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon fontSize={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
