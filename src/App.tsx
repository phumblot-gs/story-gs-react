
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import { Toaster } from "./components/ui/sonner";

import Index from "./pages/Index";
import Test from "./pages/Test";
import NotFound from "./pages/NotFound";
import ThemeCustomizerPage from "./pages/ThemeCustomizerPage";

// Individual component pages
import ActivityPanelPage from "./pages/ActivityPanelPage";
import ButtonPage from "./pages/ButtonPage";
import ButtonCirclePage from "./pages/ButtonCirclePage";
import ButtonNotificationsPage from "./pages/ButtonNotificationsPage";
import ButtonStatusPage from "./pages/ButtonStatusPage";
import LanguageSwitcherPage from "./pages/LanguageSwitcherPage";
import MediaStatusPage from "./pages/MediaStatusPage";
import NotificationPanelPage from "./pages/NotificationPanelPage";
import PageHeaderPage from "./pages/PageHeaderPage";
import StatusIndicatorPage from "./pages/StatusIndicatorPage";
import ToasterPage from "./pages/ToasterPage";
import TranslationProviderPage from "./pages/TranslationProviderPage";
import WorkflowPage from "./pages/WorkflowPage";
import WorkflowStepPage from "./pages/WorkflowStepPage";

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
            
            {/* Individual component pages */}
            <Route path="/activity-panel" element={<ActivityPanelPage />} />
            <Route path="/button" element={<ButtonPage />} />
            <Route path="/button-circle" element={<ButtonCirclePage />} />
            <Route path="/button-notifications" element={<ButtonNotificationsPage />} />
            <Route path="/button-status" element={<ButtonStatusPage />} />
            <Route path="/language-switcher" element={<LanguageSwitcherPage />} />
            <Route path="/media-status" element={<MediaStatusPage />} />
            <Route path="/notification-panel" element={<NotificationPanelPage />} />
            <Route path="/page-header" element={<PageHeaderPage />} />
            <Route path="/status-indicator" element={<StatusIndicatorPage />} />
            <Route path="/toaster" element={<ToasterPage />} />
            <Route path="/translation-provider" element={<TranslationProviderPage />} />
            <Route path="/workflow" element={<WorkflowPage />} />
            <Route path="/workflow-step" element={<WorkflowStepPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default App;
