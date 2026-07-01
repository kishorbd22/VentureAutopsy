# Venture Autopsy

![Vercel](https://img.shields.io/badge/deploy-Vercel-black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1)

An AI-powered startup failure intelligence platform that analyzes historical venture collapses to identify risk patterns, generate strategic insights, and help founders make better decisions.

## 🎯 Features

### Core Features
- **AI-Powered Analysis** - Advanced machine learning models analyze startup data
- **Risk Scoring** - Comprehensive risk assessment with detailed explanations
- **Industry Insights** - Compare performance across different sectors
- **Historical Patterns** - Learn from thousands of failed startups
- **Strategic Recommendations** - AI-generated actionable insights
- **Similar Startup Matching** - Find comparable cases from the database

### Analytics & Monitoring
- **Real-time Dashboard** - Track total analyses, daily users, and popular industries
- **Performance Metrics** - Average risk scores and trend analysis
- **Industry Breakdown** - Detailed statistics by sector
- **Request Tracking** - Unique request IDs for every API call
- **Health Monitoring** - Comprehensive health check endpoints

### Technical Features
- **RESTful API** - Well-documented FastAPI backend
- **Responsive UI** - Modern React interface with Tailwind CSS
- **Database** - PostgreSQL with SQLAlchemy ORM
- **Testing** - Comprehensive test coverage with Vitest
- **Type Safety** - Pydantic schemas for validation
- **CORS Enabled** - Configured for cross-origin requests

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Browser    │  │   React      │  │  Tailwind    │     │
│  │   (SPA)      │  │   Query      │  │    CSS       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FastAPI Server                                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  CORS      │  │ Logging    │  │   Error    │    │  │
│  │  │ Middleware │  │ Middleware │  │  Tracking  │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Analysis   │  │ Analytics    │  │   Startup    │     │
│  │   Service    │  │   Service    │  │   Analyzer   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │ Startups │ │ Analyses │ │  Users   │            │  │
│  │  └──────────┘ └──────────┘ └──────────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → Form submission with startup details
2. **API Request** → FastAPI endpoint validates with Pydantic
3. **Analysis Engine** → ML models process data against historical patterns
4. **Analytics Tracking** → Every analysis is recorded for insights
5. **Response Generation** → Risk scores, explanations, and recommendations
6. **Frontend Display** → Interactive charts and detailed reports

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query (TanStack)** - Server state management
- **React Router** - Client-side routing
- **Vitest** - Testing framework
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern, fast web framework
- **Python 3.9+** - Core language
- **SQLAlchemy** - ORM for database
- **Pydantic** - Data validation
- **Alembic** - Database migrations

### Database
- **PostgreSQL** - Primary database (production)
- **SQLite** - Local development
- **Neon PostgreSQL** - Managed cloud database

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **Fly.io** - Backend hosting (alternative)
- **Docker Compose** - Local development orchestration

## 🚀 Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn
- PostgreSQL (for production)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file:**
```env
DATABASE_URL=sqlite:///./data/startups.db
APP_NAME=Venture Autopsy
API_VERSION=v1
DEBUG=False
CORS_ORIGINS=http://localhost:5173
```

5. **Initialize database:**
```bash
python scripts/seed_db.py
```

6. **Run the server:**
```bash
uvicorn main:app --reload
```

Visit: http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
VITE_API_URL=http://localhost:8000/api/v1
```

4. **Run the development server:**
```bash
npm run dev
```

Visit: http://localhost:5173

### Docker Setup (Recommended)

The fastest way to run the entire stack:

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Start all services:**
```bash
docker compose up --build
```

This starts:
- PostgreSQL database
- Backend API at http://localhost:8000
- Frontend at http://localhost:5173

3. **Access the application:**
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/v1/health

## 📚 API Documentation

### Base URL
```
/api/v1
```

### Endpoints

#### Health & Status
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check (Kubernetes)
- `GET /health/live` - Liveness check (Kubernetes)
- `GET /health/metrics` - Application metrics

#### Startups
- `GET /startups/` - List all startups
- `GET /startups/{id}` - Get startup by ID

#### Analysis
- `POST /analysis/analyze` - Analyze a startup
- `GET /analysis/industries` - List all industries
- `GET /analysis/death-causes` - List all death causes

#### Analytics
- `GET /analytics/summary` - Analytics summary
- `GET /analytics/daily?days=30` - Daily analytics data
- `GET /analytics/industries` - Industry statistics

#### User Management
- `GET /users/` - List users
- `GET /users/{id}` - Get user by ID
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

#### Data Management
- `POST /data/import/csv` - Import startups from CSV
- `POST /data/import/validate` - Validate CSV format
- `GET /data/import/stats` - Database statistics
- `GET /data/import/sample-csv-template` - Get CSV template

### Request/Response Examples

#### Analyze Startup
```bash
POST /api/v1/analysis/analyze
Content-Type: application/json

{
  "name": "My Startup",
  "industry": "Technology",
  "sub_industry": "SaaS",
  "country": "USA",
  "total_funding_usd": 5000000,
  "number_of_employees": 50,
  "death_cause": "Cash Flow Problems",
  "stage_at_death": "Series A"
}

Response:
{
  "success": true,
  "data": {
    "score": 65,
    "risk_level": "High",
    "explanations": [...],
    "recommendations": [...]
  },
  "meta": {
    "cached": false,
    "processing_time_ms": 250
  }
}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npx vitest run
```

### Coverage
```bash
# Backend
pytest --cov=app --cov-report=html

# Frontend
npx vitest run --coverage
```

## 📊 Project Structure

```
venture-autopsy/
├── backend/
│   ├── app/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/          # API route definitions
│   │   │   ├── analyze_routes.py
│   │   │   ├── analytics_routes.py
│   │   │   ├── auth_routes.py
│   │   │   ├── health.py
│   │   │   └── api_router.py
│   │   ├── services/        # Business logic
│   │   │   ├── analytics_service.py
│   │   │   └── startup_analyzer.py
│   │   ├── models/          # Database models
│   │   │   ├── analysis.py
│   │   │   ├── startup.py
│   │   │   └── user.py
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── logging.py
│   │   │   ├── error_tracking.py
│   │   │   └── error_handler.py
│   │   ├── config/          # Configuration
│   │   └── utils/           # Helper functions
│   ├── scripts/             # Utility scripts
│   ├── migrations/          # Alembic migrations
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Base UI components
│   │   │   ├── KPICard.jsx
│   │   │   ├── RiskGauge.jsx
│   │   │   └── SimilarStartupCard.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Analytics.jsx
│   │   │   ├── AnalyzeStartup.jsx
│   │   │   └── Home.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useAnalytics.js
│   │   │   ├── useIndustries.js
│   │   │   └── useAnalysis.js
│   │   ├── services/        # API client
│   │   │   └── api.js
│   │   ├── layouts/         # Layout components
│   │   ├── lib/             # Utilities
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   ├── vercel.json          # Vercel configuration
│   └── package.json
│
├── docker-compose.yml       # Docker orchestration
├── .env.example             # Environment template
└── README.md                # This file
```

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Startup analysis engine
- [x] Risk scoring algorithm
- [x] Industry recommendations
- [x] Similar startup matching
- [x] Basic UI/UX

### Phase 2: Analytics & Monitoring ✅
- [x] Analytics dashboard
- [x] Total analyses tracking
- [x] Popular industries insights
- [x] Daily user metrics
- [x] Structured logging
- [x] Request ID tracking
- [x] Health check endpoints

### Phase 3: Enhanced Features 🔄
- [ ] User authentication & authorization
- [ ] Personalized recommendations
- [ ] Advanced filtering and search
- [ ] Export reports to PDF/CSV
- [ ] Real-time notifications
- [ ] Mobile app (React Native)

### Phase 4: AI/ML Improvements 📈
- [ ] Gemini API integration for enhanced analysis
- [ ] Natural language explanations
- [ ] Predictive modeling
- [ ] Sentiment analysis
- [ ] Custom model training
- [ ] A/B testing framework

### Phase 5: Scalability & Performance ⚡
- [ ] Redis caching layer
- [ ] Background job processing (Celery)
- [ ] Database sharding for large datasets
- [ ] CDN for static assets
- [ ] Load balancing
- [ ] Rate limiting
- [ ] API versioning

### Phase 6: Enterprise Features 🏢
- [ ] Multi-tenant architecture
- [ ] SSO integration
- [ ] Advanced RBAC
- [ ] Audit logging
- [ ] SLA monitoring
- [ ] Priority support
- [ ] White-label options

## 🔒 Security

- **Authentication** - JWT-based user authentication (coming soon)
- **Authorization** - Role-based access control
- **CORS** - Configured per environment
- **Rate Limiting** - API rate limiting enabled
- **Input Validation** - Pydantic schemas for all inputs
- **SQL Injection Protection** - SQLAlchemy ORM
- **Environment Variables** - Sensitive data in `.env`
- **HTTPS** - Enforced in production

## 📈 Performance

- **Database Indexing** - Optimized queries on frequently accessed fields
- **Query Optimization** - React Query with caching
- **Code Splitting** - Lazy loading for routes
- **Image Optimization** - Compressed assets
- **Compression** - Gzip/Brotli compression enabled
- **CDN Ready** - Static assets optimized for CDN

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 👥 Authors

- **Venture Autopsy Team** - Initial work

## 🙏 Acknowledgments

- Built with FastAPI, React, and Tailwind CSS
- Icons by Lucide
- Hosted on Vercel, Railway, and Neon

## 📞 Support

For questions and support:
- Create an issue in the repository
- Email: support@ventureautopsy.com

## 🔗 Links

- **Live Demo:** [Coming Soon]
- **API Documentation:** [Coming Soon]
- **Frontend Repository:** [GitHub]
- **Backend Repository:** [GitHub]
- **Docker Hub:** [Coming Soon]

---

**Status:** 🚀 In Active Development | **Version:** 1.0.0

Last updated: 2025