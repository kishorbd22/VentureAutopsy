# Startup Graveyard Analyzer

A full-stack application for analyzing startup failures and trends. Built with modern technologies and designed for scalability.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Python FastAPI
- **Database:** SQLite
- **Future AI:** Gemini Integration

## Project Structure

```
startup-graveyard-analyzer/
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
APP_NAME=Startup Graveyard Analyzer
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
| `APP_NAME` | Application name | `Startup Graveyard Analyzer` |
| `API_VERSION` | API version | `v1` |
| `DEBUG` | Enable debug mode | `False` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |

## Features (Planned)

- 📊 Startup failure analysis
- 📈 Trend visualization
- 🔍 Advanced search and filtering
- 🤖 AI-powered insights (Gemini integration)
- 📱 Responsive design
- 📤 Export capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Future Enhancements

- User authentication and authorization
- Advanced caching with Redis
- Background job processing
- Database migrations with Alembic
- Containerization with Docker
- CI/CD pipeline
- Rate limiting
- Request validation
- Logging and monitoring