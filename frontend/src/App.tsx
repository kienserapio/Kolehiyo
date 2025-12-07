  import { Toaster } from "@/components/ui/toaster";
  import { Toaster as Sonner } from "@/components/ui/sonner";
  import { TooltipProvider } from "@/components/ui/tooltip";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import Index from "./pages/index";
  import NotFound from "./pages/NotFound";
  import College from "./pages/college";
  import SignUp from "./pages/auth/sign_up";
  import LogIn from "./pages/auth/log_in";
  import Onboarding from "./pages/auth/onboarding";
  import Scholarship from "./pages/scholarship";
  import Board from "./pages/board";

  const queryClient = new QueryClient();

  const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            <Route path="/college" element={<College />} />
            <Route path="/auth/sign_up" element={<SignUp />} />
            <Route path="/auth/log_in" element={<LogIn />} />
            <Route path="/auth/onboarding" element={<Onboarding />} />
            <Route path="/scholarship" element={<Scholarship />} />
            <Route path="/board" element={<Board />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  export default App;
