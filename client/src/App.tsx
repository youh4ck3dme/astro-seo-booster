import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { lazy, Suspense, useEffect } from "react";
import { initGA, initWebVitals } from "@/lib/analytics";
import { useAnalytics } from "@/hooks/use-analytics";

// Lazy load pages for performance
const Home = lazy(() => import("@/pages/Home"));
const Services = lazy(() => import("@/pages/Services"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Contact = lazy(() => import("@/pages/Contact"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AdminComments = lazy(() => import("@/pages/AdminComments"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  useAnalytics();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/stahovanie" component={Services} />
        <Route path="/cennik" component={Pricing} />
        <Route path="/kontakt" component={Contact} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/admin/dashboard" component={Dashboard} />
        <Route path="/admin/comments" component={AdminComments} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();

      // Wait for gtag to be available before initializing Web Vitals
      const checkGtag = setInterval(() => {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          clearInterval(checkGtag);
          initWebVitals();
        }
      }, 100);

      // Cleanup: clear interval after 10 seconds if gtag never loads
      setTimeout(() => clearInterval(checkGtag), 10000);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
