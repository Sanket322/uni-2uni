import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import AnimalDetails from "./pages/AnimalDetails";
import AddAnimal from "./pages/AddAnimal";
import HealthRecords from "./pages/HealthRecords";
import Vaccinations from "./pages/Vaccinations";
import Breeding from "./pages/Breeding";
import Feeding from "./pages/Feeding";
import Marketplace from "./pages/Marketplace";
import MarketplaceListing from "./pages/MarketplaceListing";
import AIDoctor from "./pages/AIDoctor";
import Schemes from "./pages/Schemes";
import SchemeDetails from "./pages/SchemeDetails";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Emergency from "./pages/Emergency";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";
import VeterinaryDashboard from "./pages/VeterinaryDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import Plans from "./pages/Plans";
import RoleBasedRoute from "./components/RoleBasedRoute";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-login" element={<AdminAuth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route 
              path="/veterinary-dashboard" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["veterinary_officer", "admin"]}>
                    <VeterinaryDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coordinator-dashboard" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["program_coordinator", "admin"]}>
                    <CoordinatorDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route path="/animals" element={<ProtectedRoute><Animals /></ProtectedRoute>} />
            <Route path="/animals/add" element={<ProtectedRoute><AddAnimal /></ProtectedRoute>} />
            <Route path="/animals/:id" element={<ProtectedRoute><AnimalDetails /></ProtectedRoute>} />
            <Route path="/health" element={<ProtectedRoute><HealthRecords /></ProtectedRoute>} />
            <Route path="/vaccinations" element={<ProtectedRoute><Vaccinations /></ProtectedRoute>} />
            <Route path="/breeding" element={<ProtectedRoute><Breeding /></ProtectedRoute>} />
            <Route path="/feeding" element={<ProtectedRoute><Feeding /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/marketplace/create" element={<ProtectedRoute><MarketplaceListing /></ProtectedRoute>} />
            <Route path="/ai-doctor" element={<ProtectedRoute><AIDoctor /></ProtectedRoute>} />
            <Route path="/schemes" element={<ProtectedRoute><Schemes /></ProtectedRoute>} />
            <Route path="/schemes/:id" element={<ProtectedRoute><SchemeDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
