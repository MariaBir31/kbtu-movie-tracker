# 🎬 Movie Tracker

## Project Info

A web application developed by 3 KBTU students for the Web Development course.

The project allows users to:

* browse movies
* add new movies
* create reviews
* manage a personal watchlist

Built using Angular + Django + Django REST Framework.

---

## Team — Defenders

• Maria Birukova – Frontend / Full-Stack
• Aksu Abaidullayeva – Frontend
• Aknur Ryskul – Backend

---

## Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | Angular, CSS, HTML            |
| Backend  | Django, Django REST Framework |
| Auth     | JWT (SimpleJWT)               |

---

## Project Structure

```
kbtu-movie-tracker/
├── project/
│   ├── movietracker/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── trackerapp/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views/
│   │   └── urls.py
│   └── manage.py
│
├── project_frontend/
│   └── movie-tracker/
│       └── src/app/
│           ├── core/
│           │   ├── services/
│           │   └── interceptors/
│           ├── features/
│           │   ├── browse/
│           │   ├── cabinet/
│           │   ├── auth/
│           │   └── movie-details/
│           └── components/
│               └── add-movie/
│
└── README.md
```

---

##  Key API Endpoints

| Method | URL                                | Description                          |
| ------ | ---------------------------------- | ------------------------------------ |
| GET    | `/trackerapp/movies/`              | Get all movies                       |
| POST   | `/trackerapp/movies/`              | Add new movie                        |
| GET    | `/trackerapp/movies/<id>/`         | Get movie details                    |
| GET    | `/trackerapp/movies/<id>/rating/`  | Get average rating & count           |
| GET    | `/trackerapp/movies/<id>/reviews/` | Get all reviews for a movie          |
| POST   | `/trackerapp/movies/<id>/reviews/` | Create review (auth required)        |
| GET    | `/trackerapp/watchlist/`           | Get user's watchlist (auth required) |
| POST   | `/trackerapp/watchlist/`           | Add movie to watchlist               |
| PUT    | `/trackerapp/watchlist/<id>/`      | Update watchlist entry               |
| DELETE | `/trackerapp/watchlist/<id>/`      | Remove from watchlist                |
| POST   | `/trackerapp/auth/register/`       | Register new user                    |
| POST   | `/trackerapp/auth/login/`          | Login (returns JWT tokens)           |
| POST   | `/trackerapp/auth/logout/`         | Logout (blacklist refresh token)     |

---

## Run the Project

### Backend

```
cd project
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend URL:
http://127.0.0.1:8000/

---

### Frontend

```
cd project_frontend/movie-tracker
npm install
ng serve
```

Frontend URL:
http://localhost:4200/

---

##  Features

* User registration & login (JWT authentication)
* Browse movies
* Add new movies
* Add movies to watchlist
* Leave reviews
* View movie ratings

