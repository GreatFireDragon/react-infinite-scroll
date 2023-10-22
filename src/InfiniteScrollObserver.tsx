import { useEffect, useRef, useState } from "react";

type itemsType = {
  id: number;
  name: string;
  quote: string;
};

const HEAP_SIZE = 5;

function InfiniteScrollObserver() {
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

  // OBSERVER
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((page) => page + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    const observerConst = observerTarget.current;
    return () => {
      if (observerConst) observer.unobserve(observerConst);
    };
  }, [observerTarget]);

  // RENDER
  return (
    <div className="bg-yellow-100">
      <h1 className="pl-2 text-xl font-bold bg-lime-200">Heading</h1>
      <ul className="ml-2">
        {items.map((item) => (
          <li key={item.id} className="mb-1 bg-yellow-200 border border-dashed border-lime-300">
            <h2 className="text-lg font-bold uppercase">{item.name}</h2>
            <p className="capitalize">{item.quote}</p>
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
      {error && <p>error: {error.message}</p>}
      <div ref={observerTarget}></div>
      <h1>Big boy</h1>
    </div>
  );
}

export default InfiniteScrollObserver;
