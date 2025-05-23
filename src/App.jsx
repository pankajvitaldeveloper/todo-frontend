import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TodoShow from "./pages/TodoShow";
import TodoList from "./pages/TodoList";
import ForgetPassword from "./pages/ForgetPassword"; 
import ResetPassword from "./pages/ResetPassword";

// Separate component to access useLocation after Router is active
const AppRoutes = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/register", "/forgot-password"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <main>
      {!shouldHideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todos" element={<TodoShow />} />
        <Route path="/todolist" element={<TodoList />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
