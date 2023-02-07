import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestView from './TestView/TestView';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestView />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
