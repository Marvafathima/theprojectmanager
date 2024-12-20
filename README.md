# theprojectmanager

## Overview
A full-stack project management application built with:
- Frontend: React (Vite) with Tailwind CSS and Material Tailwind
- Backend: Django REST Framework (DRF)
- Database: PostgreSQL
- Authentication: JWT (Simple JWT)

## Prerequisites
- Python 3.8.10
- Django 4.2.16
- Node.js 16+
- npm or yarn
- PostgreSQL


### 1. Backend Environment Setup

mkdir projectmanager
#### Create a Virtual Environment
pip install virtualenv
# On Windows
virtualenv venv
venv\Scripts\activate

# On macOS/Linux
virtualenv venv
source venv/bin/activate

### 2. Clone the Repository

git clone https://github.com/Marvafathima/theprojectmanager.git
cd server

#### Install Dependencies

pip install -r requirements.txt


### 3. Environment Configuration
pip install python-dotenv

Create a `.env` file in the backend root directory with the following variables:

SECRET_KEY=your_django_secret_key
DB_NAME=your_database_name
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
EMAIL_HOST = your_email_host
EMAIL_HOST_USER =your_host_user 
EMAIL_HOST_PASSWORD =your_host_password
EMAIL_USE_TLS =
EMAIL_PORT =port_number


### 4. Database Setup

# Create PostgreSQL Database
psql -U postgres
CREATE DATABASE your_database_name;


### 5. Database Migrations

python manage.py makemigrations
python manage.py migrate


### 6. Create Superuser

python manage.py createsuperuser


### 7. Run Backend Server

python manage.py runserver &
redis-server &
celery -A server worker -l info &
celery -A server beat -l info 


### 8. To run test cases

python manage.py test


## Frontend Setup

### 1. Navigate to Frontend Directory

cd client


### 2. Install Dependencies

npm install


### 3. Run Frontend Development Server

npm run dev

### To use the local backend for development, replace the  URL in  client/src/config.jsx with the following:

export const BASE_URL = "http://localhost:8000/";

## Project Structure-server

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



## Common Issues
- Ensure PostgreSQL is running
- Check database connection settings
- Verify virtual environment activation
- Confirm all dependencies are installed



