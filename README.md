# Venture Autopsy

An AI-powered startup failure intelligence platform that analyzes historical venture collapses to identify risk patterns, generate strategic insights, and help founders make better decisions.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Python FastAPI
- **Database:** PostgreSQL (Docker) / SQLite (local)
- **Future AI:** Gemini Integration

## Project Structure

```
venture-autopsy/
├── backend/
│   ├── app/
│   │   ├── controllers/      # Request handlers and business logic
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration settings
│   │   ├── utils/           # Helper functions
│   │   └── tests/           # Backend tests
│   ├── data/                # Database files
│   ├── main.py              # Application entry point
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client services
│   │   ├── layouts/        # Layout components
│   │   ├── assets/         # Static assets
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Public assets
│   ├── index.html          # HTML template
│   └── tailwind.config.js  # Tailwind configuration
│
└── README.md
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file in the backend directory:
```env
DATABASE_URL=sqlite:///./data/startups.db
APP_NAME=Venture Autopsy
API_VERSION=v1
DEBUG=True
```

6. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

### Backend Commands

- Run with auto-reload: `uvicorn main:app --reload`
- Run tests: `pytest`
- Format code: `black .`
- Lint code: `flake8 .`

### Frontend Commands

- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Lint code: `npm run lint`

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./data/startups.db` |
| `APP_NAME` | Application name | `Venture Autopsy` |
| `API_VERSION` | API version | `v1` |
| `DEBUG` | Enable debug mode | `False` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |

## Features (Planned)

- 🧠 AI-powered failure pattern analysis
- 🎯 Strategic intelligence from historical data
- 📊 Predictive risk scoring
- 🔍 Advanced search and filtering
- 📈 Trend visualization
- 📤 Export capabilities

## Docker Setup (Recommended)

Run the entire stack with a single command using Docker Compose.

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

### Quick Start

1. Copy `.env.example` to `.env` and adjust values if needed:
```
cp .env.example .env
```

2. Start all services:
```bash
docker compose up --build
```

This starts:
- PostgreSQL on `localhost:5432`
- Backend API on `http://localhost:8000`
- Frontend on `http://localhost:5173`

3. Seed the database with default users:
```bash
docker compose exec backend python scripts/seed_db.py
```

Default users created:
- Admin: `admin@example.com` / `admin123`
- Demo: `user@example.com` / `demo123`

4. Open `http://localhost:5173` in your browser.

### Useful Commands

```bash
# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop and remove volumes (clears database)
docker compose down -v

# Rebuild after code changes
docker compose up --build
```

### Database Migrations (Alembic)

The project uses Alembic for database schema migrations.

```bash
# Create a new migration
docker compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker compose exec backend alembic upgrade head

# Rollback one migration
docker compose exec backend alembic downgrade -1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Future Enhancements

- User authentication and authorization ✅
- Advanced caching with Redis
- Background job processing
- Database migrations with Alembic ✅
- Containerization with Docker ✅
- CI/CD pipeline
- Rate limiting
- Request validation
- Logging and monitoring

## Data Ingestion Pipeline

The project includes a comprehensive data ingestion pipeline for expanding the startup database:

### Features
- **CSV Import**: Bulk import startup data from CSV files
- **Data Validation**: Comprehensive validation with error reporting
- **Data Normalization**: Standardize industries, stages, death causes, and countries
- **Batch Processing**: Efficiently process thousands of records
- **Duplicate Detection**: Skip existing records automatically
- **Statistics Generation**: Automatic calculation of database statistics
- **Export Capability**: Export filtered data to CSV

### Usage

#### Command Line Script
```bash
# Import CSV file
python backend/scripts/import_startups.py data.csv

# Import with custom batch size
python backend/scripts/import_startups.py data.csv --batch-size 500

# Import and clear existing data
python backend/scripts/import_startups.py data.csv --clear

# Validate CSV without importing
python backend/scripts/import_startups.py data.csv --validate

# Export database to CSV
python backend/scripts/import_startups.py --export output.csv

# Get database statistics
python backend/scripts/import_startups.py --stats
```

#### API Endpoints
```
POST /api/v1/data/import/csv - Upload and import CSV file
POST /api/v1/data/import/validate - Validate CSV format
GET /api/v1/data/import/stats - Get database statistics
GET /api/v1/data/import/sample-csv-template - Get CSV template
```

### CSV Format
Required columns: `name`, `industry`

Optional columns: `sub_industry`, `country`, `founded_date`, `closed_date`, `lifespan_days`, `total_funding_usd`, `funding_rounds`, `death_cause`, `death_cause_details`, `stage_at_death`, `number_of_employees`, `tags`

See `/api/v1/data/import/sample-csv-template` for example format.

### Performance
- Handles 1000+ records per batch
- Optimized for datasets with thousands of startups
- Database-backed analysis (no CSV fallback when data is imported)
- Pre-calculated industry statistics for faster risk scoring
