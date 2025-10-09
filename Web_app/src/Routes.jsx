import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import CommunityFeed from './pages/community-feed';
import OpportunityDetailPages from './pages/opportunity-detail-pages';
import InteractiveMapDashboard from './pages/interactive-map-dashboard';
import AIChatInterface from './pages/ai-chat-interface';
import PersonalImpactHub from './pages/personal-impact-hub';
import OrganizationProfiles from './pages/organization-profiles';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIChatInterface />} />
        <Route path="/community-feed" element={<CommunityFeed />} />
        <Route path="/opportunity-detail-pages" element={<OpportunityDetailPages />} />
        <Route path="/interactive-map-dashboard" element={<InteractiveMapDashboard />} />
        <Route path="/ai-chat-interface" element={<AIChatInterface />} />
        <Route path="/personal-impact-hub" element={<PersonalImpactHub />} />
        <Route path="/organization-profiles" element={<OrganizationProfiles />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
