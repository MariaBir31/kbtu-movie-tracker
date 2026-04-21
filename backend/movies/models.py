from django.db import models
from django.contrib.auth.models import User


class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Movie(models.Model):
    title = models.CharField(max_length=200)
    year = models.IntegerField()
    image = models.URLField(blank=True)
    description = models.TextField(blank=True)
    genre = models.ForeignKey(          # ForeignKey #1
        Genre,
        on_delete=models.SET_NULL,
        null=True,
        related_name='movies'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Review(models.Model):
    movie = models.ForeignKey(          # ForeignKey #2
        Movie,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(           # ForeignKey #3
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    text = models.TextField()
    rating = models.IntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} → {self.movie.title}'


class Watchlist(models.Model):
    user = models.ForeignKey(           # ForeignKey #4
        User,
        on_delete=models.CASCADE,
        related_name='watchlist'
    )
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name='watchlisted_by'
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')  # нельзя добавить один фильм дважды

    def __str__(self):
        return f'{self.user.username} → {self.movie.title}'