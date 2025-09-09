import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (query = "story", { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${query}&limit=100`
      );

      if (!res.data.docs || res.data.docs.length === 0) {
        return rejectWithValue("No books found");
      }

      return res.data.docs.map((book) => ({
        id: book.key || book?.author_key?.[0] || "",
        title: book.title || "Unknown Title",
        author_name: book.author_name
          ? book.author_name.join(", ")
          : "Unknown Author",
        author_data: book.author_name || [],
        publish_year: book.first_publish_year || "Unknown",
        cover_img: book.cover_i || null,
        language: book.language || [],
        subjects: book.subject || [],
      }));
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    allBooks: [],
    books: [],
    loading: false,
    error: null,
  },
  reducers: {
    filterByYear: (state, action) => {
      const { year, minYear, maxYear } = action.payload;

      let filtered = state.allBooks.filter((book) => {
        if (year && book.publish_year !== "Unknown") {
          return book.publish_year.toString() === year;
        }
        if (minYear && maxYear && book.publish_year !== "Unknown") {
          return (
            book.publish_year >= parseInt(minYear) &&
            book.publish_year <= parseInt(maxYear)
          );
        }
        return true;
      });

      state.books = filtered.sort((a, b) => a.publish_year - b.publish_year);
    },
    resetBooks: (state) => {
      state.books = state.allBooks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.allBooks = action.payload;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { filterByYear, resetBooks } = booksSlice.actions;
export default booksSlice.reducer;
