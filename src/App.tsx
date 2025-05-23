
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import { Toaster } from "./components/ui/sonner";

import Index from "./pages/Index";
import Test from "./pages/Test";
import NotFound from "./pages/NotFound";
import ThemeCustomizerPage from "./pages/ThemeCustomizerPage";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/test" element={<Test />} />
            <Route path="/theme-customizer" element={<ThemeCustomizerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default App;
