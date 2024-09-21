import Link from 'next/link';
import { Separator } from '../ui/separator';
import DiscordIcon from '../icons/discord';
import GithubIcon from '../icons/github';

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
          &copy; {new Date().getFullYear()} Ayoko | Developed by{' '}
          <a
            href="https://devaoto.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            devaoto
          </a>
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
