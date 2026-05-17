import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import { useAuthStore } from './store/authStore';

const Home          = React.lazy(() => import('./pages/Home'));
const About         = React.lazy(() => import('./pages/About'));
const Timeline      = React.lazy(() => import('./pages/Timeline'));
const MeetOurTeam   = React.lazy(() => import('./pages/MeetOurTeam'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Dashboard     = React.lazy(() => import('./pages/Dashboard'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-900">
    <div className="w-8 h-8 rounded-full border-2 border-stone-700 border-t-earth-400 animate-spin" />
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/"          element={<Home />} />
          <Route path="/about"     element={<About />} />
          <Route path="/timeline"  element={<Timeline />} />
          <Route path="/team"      element={<MeetOurTeam />} />
          <Route path="/admin"     element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const getCurrentUser = useAuthStore(state => state.getCurrentUser);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/*" element={
            <Layout>
              <AnimatedRoutes />
            </Layout>
          } />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
