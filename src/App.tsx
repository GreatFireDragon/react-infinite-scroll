import { ChangeEvent, Ref, useCallback, useRef, useState } from "react";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, loading, error, hasMore } = useBookSearch({ query, pageNumber });

  const observer = useRef<IntersectionObserver>();
  const lastBookElementRef = useCallback(
    (node: HTMLElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 height-full">
      <div className="flex w-3/4 mb-3">
        <input type="text" className="input" value={query} onChange={handleSearch} />
      </div>

      <div className="text-left">
        {books.map((book, i) => {
          if (books.length === i + 1) {
            return (
              <p ref={lastBookElementRef as Ref<HTMLDivElement>} key={book}>
                {book}
              </p>
            );
          }
          return <div key={book}>{book}</div>;
        })}
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>Error</div>}
    </div>
  );
}

export default App;
