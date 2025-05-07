
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Test from "./pages/Test";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeCustomizerPage from "./pages/ThemeCustomizerPage";
import { ActivityStatusProvider } from "./contexts/ActivityStatusContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeProvider>
        <ActivityStatusProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/test" element={<Test />} />
                <Route path="/theme-customizer" element={<ThemeCustomizerPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ActivityStatusProvider>
      </ThemeProvider>
    </NextThemeProvider>
  </QueryClientProvider>
);

export default App;
