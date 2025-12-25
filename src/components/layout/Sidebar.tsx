import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Shield,
  Lightbulb,
  Bell,
  Settings,
  Cpu,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Health Intelligence', href: '/health', icon: Activity },
  { name: 'Failure Prediction', href: '/prediction', icon: AlertTriangle },
  { name: 'Trust & Reliability', href: '/trust', icon: Shield },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
  { name: 'Alerts', href: '/alerts', icon: Bell },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">TrustGuard</span>
            <span className="text-xs text-muted-foreground">AI Platform</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <NavLink
            to="/settings"
            className={`sidebar-nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </div>

        {/* Status Indicator */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-success/5 px-3 py-2">
            <span className="pulse-dot bg-success" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">System Online</span>
              <span className="text-xs text-muted-foreground">All services operational</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
