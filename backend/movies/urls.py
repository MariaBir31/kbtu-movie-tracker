from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/login/', views.login_view),
    path('auth/register/', views.register_view),
    path('auth/logout/', views.logout_view),

    # Movies — полный CRUD
    path('movies/', views.MovieListView.as_view()),
    path('movies/<int:pk>/', views.MovieDetailView.as_view()),

    # Reviews
    path('movies/<int:movie_pk>/reviews/', views.ReviewListView.as_view()),
    path('movies/<int:movie_pk>/reviews/<int:pk>/', views.ReviewDetailView.as_view()),

    # Watchlist
    path('watchlist/', views.WatchlistView.as_view()),
    path('watchlist/<int:pk>/', views.WatchlistDetailView.as_view()),

    # Genres
    path('genres/', views.genre_list),
]