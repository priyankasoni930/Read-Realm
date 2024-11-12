import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBooksByGenre } from "@/lib/googleBooks";
import { Book } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BookCard from "@/components/BookCard";
import { useNavigate } from "react-router-dom";

const genres = [
  "Fantasy",
  "Romance",
  "Mystery",
  "Science Fiction",
  "Thriller",
  "Historical Fiction",
];

const GenreSection = ({ genre }: { genre: string }) => {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books", genre],
    queryFn: () => fetchBooksByGenre(genre),
  });

  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-bookCharcoal mb-6">{genre}</h2>
      <div className="relative px-4">
        <Carousel className="w-full">
          <CarouselContent>
            {books.map((book: Book) => (
              <CarouselItem
                key={book.id}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <BookCard
                  book={book}
                  onClick={() => navigate(`/book/${book.id}`)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bookBeige to-bookBeige">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-bookCharcoal text-center mb-16">
          Discover Your Next Great Read
        </h1>
        {genres.map((genre) => (
          <GenreSection key={genre} genre={genre} />
        ))}
      </div>
    </div>
  );
};

export default Index;
