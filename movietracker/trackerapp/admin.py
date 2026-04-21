from django.contrib import admin
from .models import Movie, WatchEntry, Review
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display  = ['title', 'genre', 'release_year', 'added_by', 'created_at']
    list_filter   = ['genre', 'release_year']
    search_fields = ['title', 'added_by__username']


@admin.register(WatchEntry)
class WatchEntryAdmin(admin.ModelAdmin):
    list_display  = ['user', 'movie', 'status', 'rating', 'watched_at']
    list_filter   = ['status']
    search_fields = ['user__username', 'movie__title']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ['user', 'movie', 'created_at']
    search_fields = ['user__username', 'movie__title']

# Register your models here.
