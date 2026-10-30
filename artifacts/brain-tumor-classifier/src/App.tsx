import { Switch, Route } from "wouter";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  LandingPage,
  DashboardPage,
  ClassifyPage,
  HistoryPage,
  AnalyticsPage,
  ModelPage,
  AboutPage,
} from "./pages/app-pages";
import { MultiOrganRadiomicsPage } from "./pages/radiomics-page";
import { ClinicalGuidePage } from "./pages/guide-page";
import { SmoothScrollProvider } from "./components/smooth-scroll";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScrollProvider>
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/classify" component={ClassifyPage} />
          <Route path="/radiomics" component={MultiOrganRadiomicsPage} />
          <Route path="/guide" component={ClinicalGuidePage} />
          <Route path="/history" component={HistoryPage} />
          <Route path="/analytics" component={AnalyticsPage} />
          <Route path="/model" component={ModelPage} />
          <Route path="/about" component={AboutPage} />
          <Route component={LandingPage} />
        </Switch>
      </SmoothScrollProvider>
    </QueryClientProvider>
  );
}
