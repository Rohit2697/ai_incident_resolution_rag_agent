import { BrowserRouter,Routes, Route } from "react-router-dom"
import { UploadDocument } from "./pages/UploadDocument"
import { ChatPage } from "./pages/Chat"
import { ThemeProvider } from "./components/theme-provider"

 function App() {
  return (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<UploadDocument/>}/>
    <Route path="/chat" element={<ChatPage/>}/>
  </Routes>
  </BrowserRouter>
  </ThemeProvider>  

  )
}

export default App