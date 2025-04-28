import { useState, useEffect } from "react";
import "./App.css";
import "./style.scss";
import "./media-query.css";
import Home from "./pages/Home";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Detail from "./pages/Detail";
import AddEditBlog from "./pages/AddEditBlog";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import TagBlog from "./pages/TagBlog";
import CategoryBlog from "./pages/CategoryBlog";
import ScrollToTop from "./components/ScrollToTop";
import Blogs from "./pages/Blogs";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";

function App() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setActive("login");
      navigate("/auth");
    });
  };

  //create back button for detail page
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // Check if user is in invites
        const cleanEmail = authUser.email.trim().toLowerCase();
        const docRef = doc(db, "invites", cleanEmail);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setUser(authUser);
        } else {
          // Not invited
          await signOut(auth);
          setUser(null);
          navigate("/auth");
          toast.error("Access denied: You are not invited.");
        }
      } else {
        setUser(null);
        navigate("/auth");
      }
      setCheckingAuth(false);
    });
  
    return () => unsubscribe();
  }, [navigate]);
  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App bg-faded">
      <Header setActive={setActive} active={active} user={user} handleLogout={handleLogout} />
      <ScrollToTop />
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={user ? <Home setActive={setActive} active={active} user={user} /> : <Navigate to="/auth" />} />
        <Route path="/search" element={user ? <Home setActive={setActive} user={user} /> : <Navigate to="/auth" />} />
        <Route path="/detail/:id" element={user ? <Detail setActive={setActive} user={user} /> : <Navigate to="/auth" />} />
        <Route path="/create" element={user ? <AddEditBlog user={user} /> : <Navigate to="/auth" />} />
        <Route path="/update/:id" element={user ? <AddEditBlog user={user} setActive={setActive} /> : <Navigate to="/auth" />} />
        <Route path="/blogs" element={user ? <Blogs setActive={setActive} /> : <Navigate to="/auth" />} />
        <Route path="/tag/:tag" element={user ? <TagBlog setActive={setActive} /> : <Navigate to="/auth" />} />
        <Route path="/category/:category" element={user ? <CategoryBlog setActive={setActive} /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth setActive={setActive} setUser={setUser} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
  
}

export default App;
