import {  type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { GiHamburgerMenu } from 'react-icons/gi';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type NavbarProps = {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};
export default function Navbar({ menuOpen, setMenuOpen }: NavbarProps) {
  return (
    <header className="h-14 border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="default"
          size="icon"
          className={`
    h-9 w-9
    rounded-md
    transition-colors
    hover:border-violet-500
    focus:outline-none
    focus:ring-2 focus:ring-violet-500
    focus:border-violet-500
  `}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <GiHamburgerMenu className="h-5 w-5" />
        </Button>

        <span className="font-semibold tracking-wide">RAG AI Assistant</span>
      </div>

      {/* Right side: profile */}
      <div className="relative group">
        <Tooltip>
          <TooltipTrigger>
            <User className="h-5 w-5" />
          </TooltipTrigger>
          <TooltipContent className="font-semibold">
            <p>admin</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
