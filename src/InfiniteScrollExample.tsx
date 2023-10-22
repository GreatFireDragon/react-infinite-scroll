import { useCallback, useEffect, useRef, useState } from "react";

type itemsType = {
  id: number;
  name: string;
  quote: string;
};

const HEAP_SIZE = 10;

function InfiniteScrollExample() {
  const [items, setItems] = useState<itemsType[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(0);

  const totalCount = useRef<string | null>(null);

  // FETCH DATA
  useEffect(() => {
    async function fetchData() {
      setIsloading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:3001/quotes?_start=${HEAP_SIZE * page}&_end=${HEAP_SIZE * (page + 1)}`
        );

        totalCount.current = res.headers.get("X-Total-Count");

        const data = await res.json();

        setItems((prev) => [...prev, ...data]);
        // setPage((page) => page + 1);
      } catch (error) {
        setError(new Error((error as Error).message));
      } finally {
        setIsloading(false);
      }
    }

    fetchData();
  }, [page]);

  // HADNLE SCROLL
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - 1 ||
      isLoading
    ) {
      return;
    }

    if (Number(totalCount.current) === items.length) {
      return;
    }
    setPage((page) => page + 1);
  }, [isLoading, items.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // RENDER
  return (
    <>
      <h1>Heading</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.quote}</p>
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
      {error && <p>error: {error.message}</p>}
    </>
  );
}

export default InfiniteScrollExample;
