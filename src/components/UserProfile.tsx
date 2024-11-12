import { User } from "@/lib/types";
import Bookshelf from "./Bookshelf";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-bookCharcoal">{user.name}</h1>
            <p className="text-gray-600">{user.booksRead} books read</p>
          </div>
        </div>
      </div>

      <Bookshelf
        title="Currently Reading"
        books={user.currentlyReading}
        onBookClick={(id) => navigate(`/book/${id}`)}
      />
      
      <Bookshelf
        title="Want to Read"
        books={user.wantToRead}
        onBookClick={(id) => navigate(`/book/${id}`)}
      />
    </div>
  );
};

export default UserProfile;