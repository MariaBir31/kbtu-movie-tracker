from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
class WatchEntryManager(models.Manager):
    def for_user(self, user):
        return self.filter(user=user)
    def watched(self, user):
        return self.filter(user=user,status='watched')
    def want_to_watch(self, user):
        return self.filter(user=user,status='want')
class Movie(models.Model):
    GENRE_CHOICES = [
        ('action', 'Action'),
        ('comedy', 'Comedy'),
        ('drama', 'Drama'),
        ('horror', 'Horror'),
        ('sci_fi', 'Sci-Fi'),
        ('romance', 'Romance'),
        ('animation', 'Animation'),
        ('thriller', 'Thriller'),
        ('other', 'Other'),
    ]
    title = models.CharField(max_length=100)
    genre = models.CharField(max_length=100, choices=GENRE_CHOICES, default='other')
    release_year = models.IntegerField(validators=[MinValueValidator(1888), MaxValueValidator(2100)])
    poster_url = models.URLField(max_length=200,blank=True,null=True)
    description = models.TextField(blank=True)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True,related_name='added_movies',blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.title} by {self.release_year}'
class Review(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='reviews')
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'Review by {self.user.username} on {self.movie.title}'
class WatchEntry(models.Model):
    STATUS_CHOICES = [
        ('watched', 'Watched'),
        ('want', 'Want to Watch'),
    ]
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE,related_name='watch_entries')
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='watch_entries')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='want')
    rating = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    watched_at= models.DateField(null=True, blank=True)
    note = models.TextField(blank=True)
    objects = WatchEntryManager()
    class Meta:
        unique_together = ('user', 'movie')
        ordering = ['-id']
    def __str__(self):
        return f'{self.user.username} — {self.movie.title} [{self.status}]'
# Create your models here.
