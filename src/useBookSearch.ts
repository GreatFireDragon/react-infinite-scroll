import { useEffect, useState } from "react";
import axios from "axios";

type propTypes = {
  query: string;
  pageNumber: number;
};

function useBookSearch({ query, pageNumber }: propTypes) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(false);

    axios({
      method: "GET",
      url: "https://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      signal: controller.signal,
    })
      .then((res) => {
        setBooks((prev) => {
          const newBooks = [...prev, ...res.data.docs.map((b: { title: string }) => b.title)];
          const uniqueBooks = new Set(newBooks);
          const uniqueBooksArray = Array.from(uniqueBooks);
          return uniqueBooksArray;
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });

    // cleanup 🧹
    return () => {
      controller.abort();
    };
  }, [query, pageNumber]);

  return {
    loading,
    error,
    books,
    hasMore,
  };
}

export default useBookSearch;
