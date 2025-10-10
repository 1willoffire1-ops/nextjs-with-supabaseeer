import { useSidebar } from '../hooks/useSidebar';
import { useResponsive } from '../hooks/useResponsive';
import { dashboardData } from '../data/dashboardData';

// Components
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import KPISection from '../components/dashboard/KPISection';
import VATTrendChart from '../components/dashboard/VATTrendChart';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';

// Styles
import '../styles/dashboard.css';

export default function Dashboard() {
  const { isOpen, isMobile, toggleSidebar, closeSidebar } = useSidebar();
  const { user, kpis, vatTrendData, recentActivity, quickActions, upcomingDeadlines } = dashboardData;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} isMobile={isMobile} onClose={closeSidebar} />
      
      {/* Main Content */}
      <div className={`dashboard-content transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-60'
      }`}>
        <div className="p-6">
          {/* Header */}
          <DashboardHeader 
            user={user} 
            onSidebarToggle={toggleSidebar}
            isMobile={isMobile}
          />

          {/* KPI Cards */}
          <KPISection kpis={kpis} />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* VAT Trends Chart - Spans 2 columns */}
            <div className="lg:col-span-2">
              <VATTrendChart data={vatTrendData} />
            </div>

            {/* Quick Actions */}
            <div>
              <QuickActions actions={quickActions} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div>
              <ActivityTimeline activities={recentActivity} />
            </div>

            {/* Upcoming Deadlines */}
            <div>
              <UpcomingDeadlines deadlines={upcomingDeadlines} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
