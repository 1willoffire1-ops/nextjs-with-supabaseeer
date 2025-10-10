import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AppLayout } from '@/components/layout/navigation';
import { Analytics } from '@vercel/analytics/react';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AnalyticsComponent from './pages/Analytics';
import Validation from './pages/Validation';
import Filing from './pages/Filing';
import Errors from './pages/Errors';
import Savings from './pages/Savings';
import Settings from './pages/Settings';
import Status from './pages/Status';
import Notes from './pages/Notes';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import TeamManagement from './pages/TeamManagement';
import ThemeDemo from './pages/ThemeDemo';

function App() {
  return (
    <ThemeProvider
      defaultTheme="system"
      enableSystem
    >
      <Router>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<AnalyticsComponent />} />
              <Route path="/validation" element={<Validation />} />
              <Route path="/filing" element={<Filing />} />
              <Route path="/errors" element={<Errors />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/status" element={<Status />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/verify-email" element={<VerifyEmail />} />
              <Route path="/admin/team" element={<TeamManagement />} />
              <Route path="/theme-demo" element={<ThemeDemo />} />
            </Routes>
          </AppLayout>
        </div>
      </Router>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;