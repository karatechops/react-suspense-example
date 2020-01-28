import React from "react";
import ReactDOM from "react-dom";
import Content from "./app";

function App() {
  return <Content />;
}

const rootElement = document.getElementById("root");

// ReactDOM.render(<App />, rootElement); // Blocking Mode
ReactDOM.createRoot(rootElement).render(<App />); // Concurrent Mode
