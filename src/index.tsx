import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import InfiniteScrollExample from "./InfiniteScrollExample";
import InfiniteScrollObserver from "./InfiniteScrollObserver";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  // <InfiniteScrollExample />
  <InfiniteScrollObserver />
  // </React.StrictMode>
);
