import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import PageNotFound from "./lib/PageNotFound";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import ChannelDetail from "./pages/ChannelDetail";
import Channels from "./pages/Channels";
import CreatorDetail from "./pages/CreatorDetail";
import Creators from "./pages/Creators";
import Home from "./pages/Home";
import PhotoDetail from "./pages/PhotoDetail";
import SearchResults from "./pages/SearchResults";
import StarDetail from "./pages/StarDetail";
import Stars from "./pages/Stars";
import TagPage from "./pages/TagPage";
import Trending from "./pages/Trending";
import Upload from "./pages/Upload";
import UploadedPhotoDetail from "./pages/UploadedPhotoDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/channels/:slug" element={<ChannelDetail />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/creators/:slug" element={<CreatorDetail />} />
            <Route path="/stars" element={<Stars />} />
            <Route path="/stars/:slug" element={<StarDetail />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/tags/:tagSlug" element={<TagPage />} />
            <Route path="/photo" element={<Navigate to="/" replace />} />
            <Route path="/photo/:photoId" element={<PhotoDetail />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/admin/login" replace />} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
            <Route path="/uploaded/:photoId" element={<UploadedPhotoDetail />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}
