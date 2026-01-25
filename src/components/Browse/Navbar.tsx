import MobileMenu from "./MobileMenu";
import NavbarItem from "./NavbarItem";
import { BsBell, BsChevronDown, BsSearch } from "react-icons/bs";
import { useCallback, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import { useProfile } from "../../contexts/ProfileContext";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { currentProfile } = useProfile();
  const navigate = useNavigate();
  const { profileId } = useParams();

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((current) => !current);
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch((current) => !current);
    if (showSearch) {
      setSearchInput('');
    }
  }, [showSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/browse/${profileId}/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(`/browse/${profileId}${path}`);
  };

  if (!currentProfile) {
    return null;
  }

  return (
    <nav className="w-full fixed z-40">
      <div className="px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 bg-zinc-900 bg-opacity-90">
        <img 
          className="h-4 lg:h-7 cursor-pointer" 
          src="/logo.svg" 
          alt="Logo"
          onClick={() => handleNavigation('')}
        />
        
        <div className="flex-row ml-8 gap-7 hidden lg:flex">
          <NavbarItem label="Home" onClick={() => handleNavigation('')} />
          <NavbarItem label="Series" onClick={() => handleNavigation('/series')} />
          <NavbarItem label="Films" onClick={() => handleNavigation('/movies')} />
          <NavbarItem label="New & Popular" onClick={() => handleNavigation('/new-popular')} />
          <NavbarItem label="My List" onClick={() => handleNavigation('/my-list')} />
        </div>

        <div onClick={toggleMobileMenu} className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative">
          <p className="text-white text-sm">Browse</p>
          <BsChevronDown className={`text-white transition ${showMobileMenu ? 'rotate-180' : 'rotate-0'}`} />
          <MobileMenu visible={showMobileMenu} />
        </div>

        <div className="flex flex-row ml-auto gap-7 items-center">
          {/* Search */}
          <div className="flex items-center gap-2">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search..."
                  className="bg-black bg-opacity-50 border border-gray-600 text-white px-3 py-1 rounded text-sm focus:outline-none focus:border-white"
                  autoFocus
                />
                <button type="button" onClick={toggleSearch} className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
                  <AiOutlineClose />
                </button>
              </form>
            ) : (
              <div onClick={toggleSearch} className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
                <BsSearch />
              </div>
            )}
          </div>

          <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
            <BsBell />
          </div>

          <div onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-md overflow-hidden ${currentProfile.color} flex items-center justify-center`}>
              <span className="text-white text-xlg font-semibold">
                {currentProfile?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <BsChevronDown className={`text-white transition ${showAccountMenu ? 'rotate-180' : 'rotate-0'}`} />
            <AccountMenu visible={showAccountMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
