import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from "react-router-dom"; 

import Index from "./pages/index";
import NotFound from "./pages/NotFound";
import College from "./pages/college";
import SignUp from "./pages/auth/sign_up";
import Login from "./pages/auth/log_in";
import Onboarding from "./pages/auth/onboarding";

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes> 
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/college" element={<College />} />
          <Route path="/auth/sign_up" element={<SignUp />} />
          <Route path="/auth/log_in" element={<Login />} />
          <Route path="/auth/onboarding" element={<Onboarding />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

