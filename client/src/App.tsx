import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Events from "@/pages/events";
import EventDetail from "@/pages/event-detail";
import Members from "@/pages/members";
import News from "@/pages/news";
import Contact from "@/pages/contact";
import Join from "@/pages/join";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/members" component={Members} />
      <Route path="/news" component={News} />
      <Route path="/contact" component={Contact} />
      <Route path="/join" component={Join} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
