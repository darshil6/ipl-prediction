
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Winnings from "./pages/Winnings";
import Fantasy from "./pages/Fantasy";
import Matches from "./pages/Matches";
import Scores from "./pages/Scores";
import NotFound from "./pages/NotFound";
import Nscores from "./pages/Nscores";
import Mscores from "./pages/Mscore";
import PointsTable from './components/PointsTable';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/winnings" element={<Winnings />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/fantasy" element={<Fantasy />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/nscores" element={<Nscores />} />
          <Route path="/mscores" element={<Mscores />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;





// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import Winnings from "./pages/Winnings";
// import Fantasy from "./pages/Fantasy";
// import Scores from "./pages/Scores";
// import Matches from "./pages/Matches";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/winnings" element={<Winnings />} />
//           <Route path="/matches" element={<Matches />} />
//           <Route path="/fantasy" element={<Fantasy />} />
//           <Route path="/scores" element={<Scores />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
