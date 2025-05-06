
Project Setup Instructions: Alleyway Gardens

This document outlines how to set up and run the Alleyway Gardens project locally.

---

Requirements

General:
- Python 3.10+
- Node.js (v16+)
- npm or yarn
- PostgreSQL with PostGIS extension
- Git

Backend (Django):
- Django 4.x
- Django REST Framework
- psycopg2
- GeoDjango dependencies
- drf-simplejwt
- python-decouple (for environment variables)

Frontend (React):
- React 18+
- Axios
- React Router
- Leaflet
- Bootstrap or Tailwind (depending on your styling choice)

---

Backend Setup (Django)

1. Clone the repository:
   git clone <your-repo-url>
   cd alleyway-gardens

2. Create and activate a virtual environment:
   python -m venv venv
   source venv/bin/activate   # (or venv\Scripts\activate on Windows)

3. Install dependencies:
   pip install -r requirements.txt

4. Configure .env:
   Create a .env file in the project root with:
   SECRET_KEY=your_secret_key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432

5. Set up the database (PostgreSQL with PostGIS):
   - Ensure PostGIS is enabled.
   - Create the database and user.
   - Run migrations:
     python manage.py makemigrations
     python manage.py migrate

6. Create a superuser:
   python manage.py createsuperuser

7. Run the backend server:
   python manage.py runserver

---

Frontend Setup (React)

1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Configure environment variables:
   Create a .env file in the frontend folder:
   REACT_APP_API_URL=http://localhost:8000

4. Run the frontend development server:
   npm start

---

Optional

- Testing:  
  Backend tests can be run with:
  pytest

- Static Files:  
  Collect static files for deployment:
  python manage.py collectstatic

---

Notes

- Ensure your browser allows mixed content if the frontend is on HTTP and external APIs use HTTPS.
- API keys (e.g., for Open-Meteo or Open Plantbook) should be stored in environment variables or safely accessed in frontend code if public.
