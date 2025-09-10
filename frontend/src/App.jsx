import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import Board from "./Board";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-200 flex justify-center items-center">
        <Board />
      </div>
    </Provider>
  );
}

export default App;
