from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Movie, Genre, Review, Watchlist


# --- serializers.Serializer (2 штуки) ---

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already in use.')
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value


# --- serializers.ModelSerializer (2 штуки) ---

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']


class MovieSerializer(serializers.ModelSerializer):
    genre_name = serializers.CharField(source='genre.name', read_only=True)

    class Meta:
        model = Movie
        fields = ['id', 'title', 'year', 'image', 'description', 'genre', 'genre_name', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'movie', 'user', 'username', 'text', 'rating', 'created_at']
        read_only_fields = ['user', 'movie']


class WatchlistSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    movie_id = serializers.IntegerField(write_only=True, source='movie.id')

    class Meta:
        model = Watchlist
        fields = ['id', 'movie', 'movie_id', 'added_at']
        read_only_fields = ['user']