import { useNavigate } from "react-router-dom";
import { useBooklists } from "@/hooks/useBooklists";
import BooklistCard from "@/components/library/BooklistCard";
import CreateBooklistDialog from "@/components/library/CreateBooklistDialog";

const LibraryPage = () => {
  const navigate = useNavigate();
  const { booklists, isLoading, createBooklist } = useBooklists();

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-purple-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">My Library</h1>

        <div className="mb-8">
          <CreateBooklistDialog
            onCreateBooklist={(name) => createBooklist.mutate(name)}
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {booklists.map((booklist) => (
            <BooklistCard
              key={booklist.id}
              name={booklist.name}
              books={booklist.books}
              onBookClick={handleBookClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
