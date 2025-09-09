import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, filterByYear, resetBooks } from "../../redux/booksSlice";
import "./BookFinder.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookFinder = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.books);

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(32);
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(fetchBooks(searchQuery))
        .unwrap()
        .then(() => {
          toast.success(`Results found for "${searchQuery}"`);
          setCurrentPage(1);
        })
        .catch(() => {
          toast.error("Failed to fetch books. Try again!");
        });
    } else {
      toast.info("Please enter a title or author name.");
    }
  };

  const handleFilter = () => {
    if (year || (minYear && maxYear)) {
      dispatch(filterByYear({ year, minYear, maxYear }));
      toast.success("Filter applied successfully ✅");
    } else {
      toast.warning("Enter year or year range to filter!");
    }
  };

  const handleReset = () => {
    setYear("");
    setMinYear("");
    setMaxYear("");
    dispatch(resetBooks());
    toast.info("Books reset to original list 🔄");
  };

  const handleResetTitleAuthor = () => {
    setSearchQuery("");
    dispatch(fetchBooks());
    toast.info("Books reset to original list 🔄");
  };

  // Pagination
  const LastIndex = currentPage * booksPerPage;
  const FirstIndex = LastIndex - booksPerPage;
  const currentBooks = books.slice(FirstIndex, LastIndex);
  const pageNumbers = Array.from(
    { length: Math.ceil(books.length / booksPerPage) },
    (_, i) => i + 1
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="book-loader">
          <div className="book">
            <div className="page"></div>
            <div className="page"></div>
            <div className="page"></div>
          </div>
          <p>Discovering amazing books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book_section">
      {/* Sidebar */}
      <div className="sideBar">
        <form onSubmit={handleSearch}>
          <div className="title_div">
            <h2>Title or Author</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter title or author name"
            />
            <button type="submit">Search</button>
            <button onClick={handleResetTitleAuthor}>Reset</button>
          </div>
        </form>

        <div className="year">
          <h2>Filter by Year</h2>
          <input
            type="number"
            placeholder="Enter Year (e.g. 2005)"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setMinYear("");
              setMaxYear("");
            }}
          />
          <p>OR</p>
          <div className="year_range">
            <input
              type="number"
              placeholder="Min Year"
              value={minYear}
              onChange={(e) => {
                setMinYear(e.target.value);
                setYear("");
              }}
            />
            <span> - </span>
            <input
              type="number"
              placeholder="Max Year"
              value={maxYear}
              onChange={(e) => {
                setMaxYear(e.target.value);
                setYear("");
              }}
            />
          </div>
          <button onClick={handleFilter}>Apply Filter</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>

      {/* Books */}
      <div className="">
        <div className="book_side">
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <div className="each_book" key={book.id}>
                {book.cover_img ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_img}-M.jpg`}
                    alt={book.title}
                    className="book_img"
                  />
                ) : (
                  <p>No cover image</p>
                )}
                <h4>{book.title}</h4>
                <p>
                  {book.author_data.length > 1 ? "Authors" : "Author"}:{" "}
                  {book.author_name}
                </p>
                <h3>Year: {book.publish_year}</h3>
              </div>
            ))
          ) : (
            <p>No books found</p>
          )}
        </div>

        {/* Pagination */}
        {pageNumbers.length > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BookFinder;
