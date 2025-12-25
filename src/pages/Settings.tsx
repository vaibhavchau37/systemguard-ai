import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield, Database, Key, Globe, Mail } from 'lucide-react';

export default function Settings() {
  return (
    <MainLayout title="Settings" subtitle="Configure your platform preferences">
      <div className="max-w-3xl space-y-6">
        {/* Notification Settings */}
        <div className="metric-card">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Notifications</h3>
              <p className="text-xs text-muted-foreground">Configure alert preferences</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Critical Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Receive immediate notifications for critical issues
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Warning Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Get notified about potential issues
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Daily Digest</p>
                <p className="text-xs text-muted-foreground">
                  Receive a daily summary of system health
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="metric-card">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">API Configuration</h3>
              <p className="text-xs text-muted-foreground">Backend service endpoints</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">API Endpoint</label>
              <Input
                defaultValue="https://api.trustguard.io/v1"
                className="mt-1 bg-secondary/50"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">API Key</label>
              <Input
                type="password"
                defaultValue="sk_live_xxxxxxxxxxxx"
                className="mt-1 bg-secondary/50"
              />
            </div>
            <Button variant="outline" size="sm">
              Test Connection
            </Button>
          </div>
        </div>

        {/* Security */}
        <div className="metric-card">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Security</h3>
              <p className="text-xs text-muted-foreground">Security and access settings</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Session Timeout</p>
                <p className="text-xs text-muted-foreground">
                  Automatically log out after inactivity
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
