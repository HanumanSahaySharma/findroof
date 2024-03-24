import { useSelector } from "react-redux";
// Import Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import components
import Header from "./components/Header";

// Import pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

function App() {
  const { currentUser } = useSelector((state: any) => state.user);
  return (
    <Router>
      <ToastContainer autoClose={3000} />
      <Header />
      <main className="bg-slate-100 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {currentUser && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
