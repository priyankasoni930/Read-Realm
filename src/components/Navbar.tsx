import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Library, Trophy, Users } from "lucide-react";
import ProfileButton from "./ProfileButton";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleProtectedNavigation = (e: React.MouseEvent, path: string) => {
    if (!user) {
      e.preventDefault();
      navigate("/auth");
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-bookCharcoal">
            Read Realm
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/search">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            <Link
              to="/library"
              onClick={(e) => handleProtectedNavigation(e, "/library")}
            >
              <Button variant="ghost" size="icon">
                <Library className="h-5 w-5" />
              </Button>
            </Link>

            <Link
              to="/challenges"
              onClick={(e) => handleProtectedNavigation(e, "/challenges")}
            >
              <Button variant="ghost" size="icon">
                <Trophy className="h-5 w-5" />
              </Button>
            </Link>

            <Link
              to="/groups"
              onClick={(e) => handleProtectedNavigation(e, "/groups")}
            >
              <Button variant="ghost" size="icon">
                <Users className="h-5 w-5" />
              </Button>
            </Link>

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
