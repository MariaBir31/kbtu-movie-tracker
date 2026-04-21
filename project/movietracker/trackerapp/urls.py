from django.urls import path
from .views.fbv import (
    register_view,
    login_view,
    logout_view,
    watchlist_view,
    watchlist_detail_view,
)


from .views.cbv import (
    MovieListView,
    MovieDetailView,
    ReviewListView,
    ReviewDetailView,
)
from .views.views_em import (
    movie_rating
)
urlpatterns = [
    #Auth FBVs
    path('auth/register/', register_view,  name='auth-register'),
    path('auth/login/',    login_view,    name='auth-login'),
    path('auth/logout/', logout_view, name='auth-logout'),
    #Movies CBV
    path('movies/',          MovieListView.as_view(),   name='movie-list'),
    path('movies/<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    #WatchList FBV
    path('watchlist/', watchlist_view, name='watchlist'),
    path('watchlist/<int:pk>/', watchlist_detail_view, name='watchlist-detail'),
    #Reviews CBV
    path('movies/<int:movie_pk>/reviews/', ReviewListView.as_view(), name='review-list'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),

    #views_em.py
    path('movies/<int:pk>/rating/', movie_rating),
]