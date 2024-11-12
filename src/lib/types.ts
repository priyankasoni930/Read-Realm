export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  averageRating: number;
  publishedDate: string;
  isbn: string;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  content: string;
  text: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  booksRead: number;
  currentlyReading: Book[];
  wantToRead: Book[];
}

export interface DatabaseReview {
  id: number;
  user_id: number;
  bookID: string;
  rating: number;
  content: string;
  text: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  timestamp: string;
  group_id: string;
}

export interface DatabaseGroup {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
}

export interface DatabaseMessage {
  id: string;
  text: string;
  user_id: string;
  group_id: string;
  created_at: string;
}
