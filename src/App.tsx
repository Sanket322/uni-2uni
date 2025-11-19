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
import Features from "./pages/Features";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
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
import MarketplaceDetails from "./pages/MarketplaceDetails";
import MyEnquiries from "./pages/MyEnquiries";
import AIDoctor from "./pages/AIDoctor";
import Schemes from "./pages/Schemes";
import SchemeDetails from "./pages/SchemeDetails";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Emergency from "./pages/Emergency";
import EnhancedEmergency from "./pages/EnhancedEmergency";
import NotificationPreferences from "./pages/NotificationPreferences";
import Settings from "./pages/Settings";
import SocialFeed from "./pages/SocialFeed";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";
import ReportsPage from "./pages/admin/ReportsPage";
import UsersPage from "./pages/admin/UsersPage";
import UserActivityPage from "./pages/admin/UserActivityPage";
import SubscriptionsPage from "./pages/admin/SubscriptionsPage";
import SchemesPage from "./pages/admin/SchemesPage";
import ContentPage from "./pages/admin/ContentPage";
import CommunityPage from "./pages/admin/CommunityPage";
import Messages from "./pages/Messages";
import MarketplacePage from "./pages/admin/MarketplacePage";
import MarketplaceEnquiriesPage from "./pages/admin/MarketplaceEnquiriesPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import VeterinaryDashboard from "./pages/VeterinaryDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import Plans from "./pages/Plans";
import RoleBasedRoute from "./components/RoleBasedRoute";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingGuard from "./components/OnboardingGuard";
import AddHealthRecord from "./pages/vet/AddHealthRecord";
import AddVaccination from "./pages/vet/AddVaccination";
import Onboarding from "./pages/Onboarding";
import ContentLibrary from "./pages/ContentLibrary";
import DemoLogin from "./pages/DemoLogin";
import Helpdesk from "./pages/Helpdesk";
import SubmitTicket from "./pages/SubmitTicket";
import TicketDetails from "./pages/TicketDetails";
import HelpdeskPage from "./pages/admin/HelpdeskPage";
import SLAConfiguration from "./pages/admin/SLAConfiguration";
import AdminTicketDetails from "./pages/admin/AdminTicketDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OnboardingGuard>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-login" element={<AdminAuth />} />
            <Route path="/demo-login" element={<DemoLogin />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
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
            <Route 
              path="/vet/add-health-record" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["veterinary_officer", "admin"]}>
                    <AddHealthRecord />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vet/add-vaccination" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["veterinary_officer", "admin"]}>
                    <AddVaccination />
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
          <Route path="/social" element={<ProtectedRoute><SocialFeed /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/marketplace/create" element={<ProtectedRoute><MarketplaceListing /></ProtectedRoute>} />
            <Route path="/marketplace/:id" element={<ProtectedRoute><MarketplaceDetails /></ProtectedRoute>} />
            <Route path="/my-enquiries" element={<ProtectedRoute><MyEnquiries /></ProtectedRoute>} />
            <Route path="/ai-doctor" element={<ProtectedRoute><AIDoctor /></ProtectedRoute>} />
            <Route path="/schemes" element={<ProtectedRoute><Schemes /></ProtectedRoute>} />
            <Route path="/schemes/:id" element={<ProtectedRoute><SchemeDetails /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/notification-preferences" element={<ProtectedRoute><NotificationPreferences /></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute><EnhancedEmergency /></ProtectedRoute>} />
            <Route path="/emergency-old" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
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
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ReportsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <UsersPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-activity"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <UserActivityPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/subscriptions"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <SubscriptionsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schemes"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <SchemesPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ContentPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/marketplace"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <MarketplacePage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/marketplace-enquiries"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <MarketplaceEnquiriesPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <NotificationsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/community"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <CommunityPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/helpdesk"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <HelpdeskPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sla-configuration"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <SLAConfiguration />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ticket/:ticketId"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminTicketDetails />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route path="/helpdesk" element={<ProtectedRoute><Helpdesk /></ProtectedRoute>} />
            <Route path="/submit-ticket" element={<ProtectedRoute><SubmitTicket /></ProtectedRoute>} />
            <Route path="/ticket/:ticketId" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </OnboardingGuard>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
