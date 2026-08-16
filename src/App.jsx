import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Episode from "./pages/Episode";
import Search from "./pages/Search";
import GenrePage from "./pages/GenrePage";
import GenreIndex from "./pages/GenreIndex";
import Schedule from "./pages/Schedule";
import Bookmarks from "./pages/Bookmarks";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import config from "./config";
import { GithubIcon } from "./components/icons";
import { AuthProvider } from "./context/AuthContext";

function Footer() {
  return (
    <footer className="mt-10 border-t-2 border-ink bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-cream/50 sm:flex-row">
        <span>© {new Date().getFullYear()} {config.name}. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>Built by {config.creator}</span>
          {config.github && (
            <a href={config.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-cream">
              <GithubIcon width="14" height="14" /> GitHub
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-bold">404</h1>
      <p className="mt-2 font-mono text-sm text-ink/50">Halaman nggak ketemu.</p>
      <Link to="/" className="mt-4 inline-block font-mono text-sm underline">Balik ke beranda</Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-cream font-body text-ink">
          <Navbar />
          <div className="flex-1 pb-20 lg:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime/:id" element={<Detail />} />
              <Route path="/episode/:episodeId" element={<Episode />} />
              <Route path="/genre" element={<GenreIndex />} />
              <Route path="/genre/:id" element={<GenrePage />} />
              <Route path="/jadwal" element={<Schedule />} />
              <Route path="/bookmark" element={<Bookmarks />} />
              <Route path="/riwayat" element={<History />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
          <BottomNav />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
