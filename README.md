# theprojectmanager

## Overview
A full-stack project management application built with:
- Frontend: React (Vite) with Tailwind CSS and Material Tailwind
- Backend: Django REST Framework (DRF)
- Database: PostgreSQL
- Authentication: JWT (Simple JWT)

## Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn
- PostgreSQL

## Backend Setup

### 1. Clone the Repository

git clone https://github.com/yourusername/project-management-app.git
cd project-management-app


### 2. Backend Environment Setup

#### Create a Virtual Environment

# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate


#### Install Dependencies

pip install -r requirements.txt


### 3. Environment Configuration
Create a `.env` file in the backend root directory with the following variables:

SECRET_KEY=your_django_secret_key
DB_NAME=your_database_name
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password


### 4. Database Setup

# Create PostgreSQL Database
psql -U postgres
CREATE DATABASE your_database_name;
```

### 5. Database Migrations

python manage.py makemigrations
python manage.py migrate


### 6. Create Superuser (Optional)

python manage.py createsuperuser
```

### 7. Run Backend Server

python manage.py runserver


## Frontend Setup

### 1. Navigate to Frontend Directory

cd client
```

### 2. Install Dependencies

npm install


### 3. Run Frontend Development Server

npm run dev


## Project Structure

project-management-app/
│
├── server/
├── manage.py
├── media
│   └── profile_pics
├── projects
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── migrations
│   ├── models.py
│   ├── Pagination.py
│   ├── permissions.py
│   ├── __pycache__
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── requirements.txt
├── server
│   ├── asgi.py
│   ├── __init__.py
│   ├── __pycache__
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── userauthentication
    ├── admin.py
    ├── apps.py
    ├── __init__.py
    ├── migrations
    ├── models.py
    ├── __pycache__
    ├── serializers.py
    ├── tests.py
    ├── urls.py
    └── views.py

## Key Dependencies
### Backend
- Django
- Django REST Framework
- Simple JWT
- psycopg2
- django-cors-headers

### Frontend
- React
- Redux Toolkit
- Tailwind CSS
- Material Tailwind
- Lucide React
- Heroicons
- Axios

## Authentication
The application uses JWT (JSON Web Token) authentication:
- Register a new user
- Login to receive access and refresh tokens
- Use tokens for authenticated requests

## Media Files
Media uploads are stored in the `server/media/` directory.

## Deployment Considerations
- Set `DEBUG=False` in production
- Use environment-specific settings
- Configure CORS settings
- Set up proper database credentials
- Use a production-ready web server (Gunicorn, uWSGI)

## Common Issues
- Ensure PostgreSQL is running
- Check database connection settings
- Verify virtual environment activation
- Confirm all dependencies are installed



