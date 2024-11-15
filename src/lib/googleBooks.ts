const API_KEY ='AIzaSyBWJspfe74L5OnvOzWikxbfKDGQdhB8_no';
//"AIzaSyCKgE6qqN6GoEQsnvgQUQ4QH9eBNdG0-sU"
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export const fetchBooksByGenre = async (genre: string) => {
  const response = await fetch(
    `${BASE_URL}?q=subject:${genre}&key=${API_KEY}&maxResults=10`
  );
  const data = await response.json();

  return (
    data.items?.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || "Unknown Author",
      coverUrl:
        item.volumeInfo.imageLinks?.thumbnail ||
        "https://via.placeholder.com/128x196",
      description: item.volumeInfo.description || "No description available",
      averageRating: item.volumeInfo.averageRating || 0,
      publishedDate: item.volumeInfo.publishedDate || "",
      isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || "",
    })) || []
  );
};

export const fetchBookById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}?key=${API_KEY}`);
  const item = await response.json();

  return {
    id: item.id,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.[0] || "Unknown Author",
    coverUrl:
      item.volumeInfo.imageLinks?.thumbnail ||
      "https://via.placeholder.com/128x196",
    description: item.volumeInfo.description || "No description available",
    averageRating: item.volumeInfo.averageRating || 0,
    publishedDate: item.volumeInfo.publishedDate || "",
    isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || "",
  };
};

export const searchBooks = async (query: string) => {
  const response = await fetch(
    `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=20`
  );
  const data = await response.json();

  return (
    data.items?.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || "Unknown Author",
      coverUrl:
        item.volumeInfo.imageLinks?.thumbnail ||
        "https://via.placeholder.com/128x196",
      description: item.volumeInfo.description || "No description available",
      averageRating: item.volumeInfo.averageRating || 0,
      publishedDate: item.volumeInfo.publishedDate || "",
      isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || "",
    })) || []
  );
};
