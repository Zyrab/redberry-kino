import { Routes, Route } from "react-router";
import Layout from "./components/layout/layout";
import Home from "./pages/home";
import MyProfile from "./pages/my-profile";
// import Sessions from "./pages/sessions";
// import Movie from "./pages/movie";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/my-profile" element={<MyProfile />} />
        {/* <Route path="/sessions" element={<Sessions />} />
        <Route path="/movies/:slug" element={<Movie />} /> */}
      </Route>
    </Routes>
  );
}
