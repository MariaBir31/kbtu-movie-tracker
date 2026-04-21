# 🎬 MovieTracker — Angular Frontend

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (proxies /api → Django on port 8000)
ng serve
# App runs at http://localhost:4200
```

## Requirements: make sure Django backend is running first
```bash
cd ../movietracker
python manage.py runserver   # runs on http://localhost:8000
```

---

## Rubric coverage

| Requirement | Where |
|---|---|
| Interfaces & services | `models.ts`, `services/auth.service.ts`, `services/movie.service.ts` |
| 4+ (click) events → API | movies.component (addMovie, applyFilter, addToWatchlist), movie-detail.component (toggleStatus, setRating, removeFromWatchlist, postReview), watchlist.component (updateStatus, setRating, remove) |
| 4+ [(ngModel)] form controls | login (username, password), register (username, email, password, password2), movies (title, year, genre, poster, description), watchlist (status select, note input) |
| CSS styling | Inline styles in every component — dark cinema theme |
| Routing — 3+ named routes | `app.routes.ts` — /login, /register, /movies, /movies/:id, /watchlist |
| @for / @if | movies.component, movie-detail.component, watchlist.component |
| JWT auth + interceptor | `interceptors/jwt.interceptor.ts`, `guards/auth.guard.ts`, login/logout in auth.service |
| HttpClient service | `services/movie.service.ts` — all API calls go through here |
| Error handling | Every `.subscribe({ error: e => this.error = e.message })`, interceptor extracts Django error messages |

---

## File structure
```
src/
├── main.ts
├── styles.css
└── app/
    ├── app.component.ts       ← root + navbar
    ├── app.config.ts          ← registers interceptor
    ├── app.routes.ts          ← all routes
    ├── models.ts              ← TypeScript interfaces
    ├── services/
    │   ├── auth.service.ts    ← login/register/logout/refresh
    │   └── movie.service.ts   ← all movie/watchlist/review API calls
    ├── interceptors/
    │   └── jwt.interceptor.ts ← attaches Bearer token, handles 401
    ├── guards/
    │   └── auth.guard.ts      ← protects routes
    ├── components/
    │   └── navbar/
    └── pages/
        ├── login/
        ├── register/
        ├── movies/            ← browse + add movie
        ├── movie-detail/      ← ratings + reviews
        └── watchlist/         ← my list with status/rating
```
