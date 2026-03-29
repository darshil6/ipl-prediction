
import { useState } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Winnings', path: '/winnings' },
    { name: 'Matches', path: '/matches' },
    // { name: 'Fantasy Team', path: '/fantasy' },
    { name: 'Scores', path: '/scores' },
    { name: 'Team vs Team', path: '/nscores' },
    { name: 'Batter vs Bowler', path: '/mscores' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and site name */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-ipl-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">IPL</span>
              </div>
              <span className="text-ipl-blue font-bold text-xl hidden sm:block">PredictIPL</span>
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigate(link.path)}
                className={`text-gray-700 hover:text-ipl-blue transition-colors duration-200 font-medium ${location.pathname === link.path ? 'text-ipl-orange font-semibold' : ''
                  }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Search bar and auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search teams, matches..."
                className="bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ipl-blue/50 w-48 lg:w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            <Button className="bg-ipl-orange hover:bg-ipl-orange/90 text-white">
              Login / Signup
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-ipl-blue" />
              ) : (
                <Menu className="h-6 w-6 text-ipl-blue" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="pt-2 pb-4 px-4 space-y-1 sm:px-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="block py-2 text-base font-medium text-gray-700 hover:text-ipl-blue hover:bg-gray-50 rounded-md px-3"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 pb-2">
              <div className="relative mt-1">
                <input
                  type="text"
                  placeholder="Search teams, matches..."
                  className="bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ipl-blue/50"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              <Button className="bg-ipl-orange hover:bg-ipl-orange/90 text-white w-full mt-4">
                Login / Signup
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
