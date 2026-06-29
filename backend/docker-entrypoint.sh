#!/bin/sh

# Wait for database to be ready
echo "Waiting for database..."
until python -c "
import psycopg2
import os
try:
    conn = psycopg2.connect(
        host=os.environ.get('POSTGRES_SERVER', 'db'),
        port=os.environ.get('POSTGRES_PORT', '5432'),
        user=os.environ.get('POSTGRES_USER', 'postgres'),
        password=os.environ.get('POSTGRES_PASSWORD', 'postgres'),
        dbname=os.environ.get('POSTGRES_DB', 'venture_autopsy')
    )
    conn.close()
    print('Database is ready')
except Exception as e:
    print('Database not ready yet:', e)
    exit(1)
"; do
  sleep 2
done

# Initialize database schema
echo "Initializing database schema..."
python -c "from app.config.database import init_database; init_database()"

# Run any pending migrations if Alembic is configured
if [ -f "alembic.ini" ]; then
  echo "Running migrations..."
  alembic upgrade head
fi

# Start the application
echo "Starting application..."
exec "$@"