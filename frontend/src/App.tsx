import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import AppContextsProvider from "./contexts/AppContextsProvider";
import Products from "./pages/Products";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <AppContextsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="contact" element={<Contact />} />
              <Route path="cart" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="about" element={<About />} />
              <Route path="profile" element={<Profile />} />
              <Route path="adminPanel" element={<AdminPanel />} />

              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextsProvider>
    </>
  );
}

export default App;
