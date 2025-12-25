# 🚀 SRE Intelligence Dashboard

An AI-powered Site Reliability Engineering dashboard with real-time health monitoring, predictive failure analysis, and autonomous insight generation.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20TypeScript%20%2B%20Supabase-blue)

## ✨ Features

### 🏥 Health Intelligence Engine
Multi-factor weighted algorithm for system health scoring:
```
Health Score = 100 - (0.30 × ErrorPenalty + 0.25 × LatencyPenalty + 
                      0.20 × UptimePenalty + 0.15 × CPUPenalty + 0.10 × MemoryPenalty)
```
- Real-time component health monitoring
- Trend analysis with historical data
- Status classification: Healthy → Degrading → Critical

### ⚠️ Failure Prediction Engine
Pattern-based prediction using multiple signals:
```
Risk = 0.35 × ThresholdProximity + 0.30 × TrendVelocity + 
       0.20 × CorrelationScore + 0.15 × HistoricalPattern
```
- Predictive failure windows
- Severity classification with confidence scores
- Contributing factor analysis

### 🛡️ Trust & Reliability Engine
Unique stability-penalty model:
```
Trust = BaseStability × (1 - FailurePenalty) × RecoveryBonus × ConsistencyMultiplier
```
- MTBF/MTTR tracking
- Reliability trend analysis
- Trust factor breakdown

### 🧠 Autonomous Insight Engine
Multi-signal correlation with anomaly detection:
- **Z-Score Anomaly Detection**: Statistical deviation analysis
- **Root Cause Analysis**: Dependency graph traversal
- **Impact Scoring**: Blast radius calculation
- **Auto-Remediation**: Suggested actions with automation flags

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Recharts |
| Backend | Supabase Edge Functions (Deno) |
| State Management | TanStack Query |
| Routing | React Router v6 |

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard widgets
│   │   │   ├── ScoreRing.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── PredictionCard.tsx
│   │   │   ├── TrustMeter.tsx
│   │   │   └── InsightCard.tsx
│   │   ├── layout/          # App layout
│   │   └── ui/              # shadcn components
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── HealthIntelligence.tsx
│   │   ├── FailurePrediction.tsx
│   │   ├── TrustReliability.tsx
│   │   ├── Insights.tsx
│   │   └── Alerts.tsx
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   └── mockData.ts      # Fallback data
│   └── hooks/
│       └── useApiData.ts    # Data fetching hook
├── supabase/
│   └── functions/
│       ├── health/          # Health scoring engine
│       ├── failure-risk/    # Prediction engine
│       ├── trust-score/     # Trust calculation
│       └── insights/        # Autonomous insights
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sre-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | System health metrics & score |
| `GET /failure-risk` | Failure predictions |
| `GET /trust-score` | Trust & reliability metrics |
| `GET /insights` | Autonomous insights |
| `GET /alerts` | Active alerts |

## 📊 Algorithm Details

### Health Score Calculation
```typescript
const weights = {
  errorRate: 0.30,    // Highest impact
  latency: 0.25,      // Performance critical
  uptime: 0.20,       // Availability
  cpu: 0.15,          // Resource utilization
  memory: 0.10        // Memory pressure
};
```

### Failure Prediction Logic
1. **Threshold Proximity**: Distance to critical thresholds
2. **Trend Analysis**: Rate of change over time
3. **Correlation**: Cross-component dependency analysis
4. **Historical Patterns**: Past incident matching

### Trust Score Model
- **Base Stability**: Uptime × (1 - ErrorRate)
- **Failure Penalty**: Recent failures impact
- **Recovery Bonus**: Fast MTTR rewards
- **Consistency**: Low variance multiplier

## 🎯 Key Differentiators

1. **Explainable AI**: All scores show calculation breakdown
2. **Real-time Updates**: 30-second refresh cycle
3. **Autonomous Insights**: Self-generating recommendations
4. **Trust Engine**: Unique reliability metric

## 📝 License

MIT License - feel free to use for your projects!

---

Built with ❤️ using [Lovable](https://lovable.dev)
