import { type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { GiHamburgerMenu } from 'react-icons/gi';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link,useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa6';

type NavbarProps = {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};
export default function Navbar({ menuOpen, setMenuOpen }: NavbarProps) {

  const navigate = useNavigate();
  return (
    <header className="h-14 border-b flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <GiHamburgerMenu className="h-5 w-5" />
        </Button>

        <span className="font-semibold tracking-wide flex items-center gap-2 cursor-pointer" onClick={()=>navigate('/')}>
          <img src="/logo.png" className="h-10 w-10" />
          RAG AI Assistant
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Link
          to="/about"
          className="text-sm font-medium hover:text-violet-600 transition"
        >
          About
        </Link>

        <a
          href="https://github.com/Rohit2697/ai_incident_resolution_rag_agent"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          className="hover:text-violet-600 transition"
        >
          <FaGithub className="h-5 w-5" />
        </a>

        <Tooltip>
          <TooltipTrigger>
            <User className="h-5 w-5" />
          </TooltipTrigger>
          <TooltipContent>
            <p>admin</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}

