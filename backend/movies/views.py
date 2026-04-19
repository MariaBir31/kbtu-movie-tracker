from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Movie, Genre, Review, Watchlist
from .serializers import (
    LoginSerializer, RegisterSerializer,
    MovieSerializer, GenreSerializer,
    ReviewSerializer, WatchlistSerializer
)


# ========== FBV #1 — Login ==========
@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    try:
        username = User.objects.get(email=email).username
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials.'}, status=400)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials.'}, status=400)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
        }
    })


# ========== FBV #2 — Register ==========
@api_view(['POST'])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    user = User.objects.create_user(
        username=serializer.validated_data['username'],
        email=serializer.validated_data['email'],
        password=serializer.validated_data['password'],
    )
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
        }
    }, status=201)


# ========== FBV #3 — Logout ==========
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out.'})


# ========== CBV #1 — Movie List + Create ==========
class MovieListView(APIView):

    def get(self, request):
        movies = Movie.objects.select_related('genre').all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response({'error': 'Admin only.'}, status=403)
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# ========== CBV #2 — Movie Detail + Update + Delete ==========
class MovieDetailView(APIView):

    def get_object(self, pk):
        try:
            return Movie.objects.select_related('genre').get(pk=pk)
        except Movie.DoesNotExist:
            return None

    def get(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Not found.'}, status=404)
        return Response(MovieSerializer(movie).data)

    def put(self, request, pk):
        if not request.user.is_staff:
            return Response({'error': 'Admin only.'}, status=403)
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Not found.'}, status=404)
        serializer = MovieSerializer(movie, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response({'error': 'Admin only.'}, status=403)
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Not found.'}, status=404)
        movie.delete()
        return Response(status=204)


# ========== CBV #3 — Watchlist ==========
class WatchlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Watchlist.objects.filter(user=request.user).select_related('movie__genre')
        return Response(WatchlistSerializer(items, many=True).data)

    def post(self, request):
        movie_id = request.data.get('movie')
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({'error': 'Movie not found.'}, status=404)

        item, created = Watchlist.objects.get_or_create(user=request.user, movie=movie)
        if not created:
            return Response({'error': 'Already in watchlist.'}, status=400)
        return Response(WatchlistSerializer(item).data, status=201)


class WatchlistDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            item = Watchlist.objects.get(pk=pk, user=request.user)
            item.delete()
            return Response(status=204)
        except Watchlist.DoesNotExist:
            return Response({'error': 'Not found.'}, status=404)


# ========== CBV #4 — Reviews ==========
class ReviewListView(APIView):

    def get(self, request, movie_pk):
        reviews = Review.objects.filter(movie_id=movie_pk).select_related('user')
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request, movie_pk):
        if not request.user.is_authenticated:
            return Response({'error': 'Login required.'}, status=401)
        try:
            movie = Movie.objects.get(pk=movie_pk)
        except Movie.DoesNotExist:
            return Response({'error': 'Movie not found.'}, status=404)

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, movie=movie)  # привязка к user
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, movie_pk, pk):
        try:
            review = Review.objects.get(pk=pk, movie_id=movie_pk)
        except Review.DoesNotExist:
            return Response({'error': 'Not found.'}, status=404)

        if review.user != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied.'}, status=403)

        review.delete()
        return Response(status=204)


# ========== Genre list ==========
@api_view(['GET'])
def genre_list(request):
    genres = Genre.objects.all()
    return Response(GenreSerializer(genres, many=True).data)