import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Library, Trophy, Users, Menu } from "lucide-react";
import ProfileButton from "./ProfileButton";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = ({ isMobile = false }) => {
    const handleClick = () => {
      if (isMobile) {
        setIsOpen(false);
      }
    };

    return (
      <>
        <Link to="/search" onClick={handleClick}>
          <Button variant="ghost" size={isMobile ? "default" : "icon"} className={isMobile ? "w-full justify-start" : ""}>
            <Search className="h-5 w-5" />
            {isMobile && <span className="ml-2">Search</span>}
          </Button>
        </Link>
        
        <Link to="/library" onClick={handleClick}>
          <Button variant="ghost" size={isMobile ? "default" : "icon"} className={isMobile ? "w-full justify-start" : ""}>
            <Library className="h-5 w-5" />
            {isMobile && <span className="ml-2">Library</span>}
          </Button>
        </Link>

        <Link to="/challenges" onClick={handleClick}>
          <Button variant="ghost" size={isMobile ? "default" : "icon"} className={isMobile ? "w-full justify-start" : ""}>
            <Trophy className="h-5 w-5" />
            {isMobile && <span className="ml-2">Challenges</span>}
          </Button>
        </Link>

        <Link to="/groups" onClick={handleClick}>
          <Button variant="ghost" size={isMobile ? "default" : "icon"} className={isMobile ? "w-full justify-start" : ""}>
            <Users className="h-5 w-5" />
            {isMobile && <span className="ml-2">Forums</span>}
          </Button>
        </Link>

        {user ? (
          <>
            <div onClick={handleClick}>
              <ProfileButton />
            </div>
            <Button 
              onClick={() => {
                signOut();
                handleClick();
              }} 
              variant="outline" 
              className={isMobile ? "w-full text-center justify-center" : ""}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Link to="/auth" className={isMobile ? "w-full" : ""} onClick={handleClick}>
            <Button className={isMobile ? "w-full text-center justify-center" : ""}>Sign In</Button>
          </Link>
        )}
      </>
    );
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-bookCharcoal">
            BookApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  <NavItems isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
