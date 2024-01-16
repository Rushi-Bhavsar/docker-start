import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1 className="App-title">Welcome to React</h1>
          <Link to="/">Home</Link>
          <br></br>
          <Link to="/otherpage">Other Page</Link>
        </header>
        <div>
          <Routes>
            <Route exact path="/" element={<Fib />} />
            <Route path="/otherpage" element={<OtherPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
