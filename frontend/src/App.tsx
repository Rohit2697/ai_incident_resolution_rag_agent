// import { BrowserRouter,Routes, Route } from "react-router-dom"
import UploadDocumentPage from './pages/UploadDocumentPage';
import ChatPage from './pages/ChatPage';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { ChatPage } from "./pages/Chat"
import Navbar from './components/navbar';
import { ThemeProvider } from './components/theme-provider';
import Sidebar from './components/sidebar';
import { useState } from 'react';

function App() {
  // const [uploading, setUploading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);
  const [refreshSideBar, setRefreshSideBar] = useState(true);
  const [collections, setCollections] = useState<string[]>([]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen overflow-hidden flex flex-col">
        {/* Navbar */}
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {menuOpen && (
            <Sidebar
            collections={collections}
            setCollections={setCollections}
              refreshSideBar={refreshSideBar}
              setRefreshSideBar={setRefreshSideBar}
            />
          )}

          {/* Main area */}
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<UploadDocumentPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
