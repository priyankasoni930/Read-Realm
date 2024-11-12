"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Library, Trophy, Users, Menu } from "lucide-react";
import ProfileButton from "./ProfileButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleProtectedNavigation = (path: string) => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const NavItems = () => (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          navigate("/search");
          setIsOpen(false);
        }}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleProtectedNavigation("/library")}
      >
        <Library className="h-5 w-5" />
        <span className="sr-only">Library</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleProtectedNavigation("/challenges")}
      >
        <Trophy className="h-5 w-5" />
        <span className="sr-only">Challenges</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleProtectedNavigation("/groups")}
      >
        <Users className="h-5 w-5" />
        <span className="sr-only">Groups</span>
      </Button>
    </>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-bookCharcoal">
            Read Realm
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
            {user ? (
              <>
                <ProfileButton />
                <Button onClick={signOut} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      navigate("/search");
                      setIsOpen(false);
                    }}
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleProtectedNavigation("/library")}
                  >
                    <Library className="mr-2 h-5 w-5" />
                    Library
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleProtectedNavigation("/challenges")}
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Challenges
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleProtectedNavigation("/groups")}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Groups
                  </Button>
                  {user ? (
                    <>
                      <ProfileButton />
                      <Button onClick={handleSignOut} variant="outline">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate("/auth");
                        setIsOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
