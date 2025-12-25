import { MainLayout } from '@/components/layout/MainLayout';
import { ComponentCard } from '@/components/dashboard/ComponentCard';
import { componentHealth } from '@/lib/mockData';
import { Filter, Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

type FilterType = 'all' | 'healthy' | 'degrading' | 'critical';

export default function HealthIntelligence() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = componentHealth.filter((component) => {
    const matchesFilter = filter === 'all' || component.status === filter;
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: componentHealth.length,
    healthy: componentHealth.filter((c) => c.status === 'healthy').length,
    degrading: componentHealth.filter((c) => c.status === 'degrading').length,
    critical: componentHealth.filter((c) => c.status === 'critical').length,
  };

  return (
    <MainLayout
      title="Health Intelligence"
      subtitle="Component-level health monitoring and analysis"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          {(['all', 'healthy', 'degrading', 'critical'] as FilterType[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-xl border p-4 text-left transition-all ${
                filter === status
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <p className="text-sm capitalize text-muted-foreground">{status}</p>
              <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                {statusCounts[status]}
              </p>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="flex rounded-lg border border-border">
            <Button variant="ghost" size="icon" className="rounded-r-none">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-l-none border-l border-border">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Component Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((component, index) => (
            <div
              key={component.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ComponentCard component={component} />
            </div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-secondary p-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No components found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
