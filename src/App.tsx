import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StateProvider } from "@/contexts/StateContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SchemesPage from "./pages/SchemesPage";
import SchemeDetailPage from "./pages/SchemeDetailPage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import ScholarshipDetailPage from "./pages/ScholarshipDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import GovtSchemesPage from "./pages/GovtSchemesPage";
import GovtSchemeDetailPage from "./pages/GovtSchemeDetailPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <StateProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes */}
                <Route path="/" element={<ProtectedLayout><LandingPage /></ProtectedLayout>} />
                <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
                <Route path="/schemes" element={<ProtectedLayout><SchemesPage /></ProtectedLayout>} />
                <Route path="/schemes/:id" element={<ProtectedLayout><SchemeDetailPage /></ProtectedLayout>} />
                <Route path="/scholarships" element={<ProtectedLayout><ScholarshipsPage /></ProtectedLayout>} />
                <Route path="/scholarships/:id" element={<ProtectedLayout><ScholarshipDetailPage /></ProtectedLayout>} />
                <Route path="/govt-schemes" element={<ProtectedLayout><GovtSchemesPage /></ProtectedLayout>} />
                <Route path="/govt-schemes/:id" element={<ProtectedLayout><GovtSchemeDetailPage /></ProtectedLayout>} />
                <Route path="/analytics" element={<ProtectedLayout><AnalyticsPage /></ProtectedLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </StateProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
