from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..models import Movie,Review
from ..serializers import MovieSerializer,ReviewSerializer
from rest_framework import status
class MovieListView(APIView):
    """
        GET  /trackerapp/movies/   — list all movies
        POST /trackerapp/movies/   — add a new movie (links to request.user)
        """
    permission_classes = (AllowAny,)
    def get(self,request):
        movies = Movie.objects.select_related('added_by').all()
        serializer = MovieSerializer(movies,many=True)
        return Response(serializer.data)
    def post(self,request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(added_by=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class MovieDetailView(APIView):
    """
        GET    /trackerapp/movies/<pk>/  — retrieve one movie
        PUT    /trackerapp/movies/<pk>/  — update movie (only creator can edit)
        DELETE /trackerapp/movies/<pk>/  — delete movie (only creator can delete)
        """
    permission_classes = (AllowAny,)
    def get_object(self,pk):
        try:
            return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            return None
    def get(self,request,pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error':'Movie not found'},status=status.HTTP_404_NOT_FOUND)
        return Response(MovieSerializer(movie).data)
    def put(self,request,pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error':'Movie not found'},status=status.HTTP_404_NOT_FOUND)
        if movie.added_by != request.user:
            return Response({'error':'You can only edit movies you added'},status=status.HTTP_403_FORBIDDEN)
        serializer = MovieSerializer(movie,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error':'Movie not found'},status=status.HTTP_404_NOT_FOUND)
        if movie.added_by != request.user:
            return Response({'error': 'You can only delete movies you added.'}, status=status.HTTP_403_FORBIDDEN)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ReviewListView(APIView):
    """
       GET  /trackerapp/movies/<movie_pk>/reviews/  — list reviews for a movie
       POST /trackerapp/movies/<movie_pk>/reviews/  — post a review
       """
    permission_classes = (AllowAny,)
    def get(self,request,movie_pk):
        reviews = Review.objects.filter(movie_id=movie_pk).select_related('user')
        serializer = ReviewSerializer(reviews,many=True)
        return Response(serializer.data)
    def post(self,request,movie_pk):
        if not Movie.objects.filter(pk=movie_pk).exists():
            return Response({'error':'Movie not found'},status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, movie_id=movie_pk)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class ReviewDetailView(APIView):
    """
        DELETE /trackerapp/reviews/<pk>/  — delete own review
        """
    permission_classes = (AllowAny,)
    def delete(self,request,pk):
        try:
            review = Review.objects.get(pk=pk,user=request.user)
        except Review.DoesNotExist:
            return Response({'error':'Review not found'},status=status.HTTP_404_NOT_FOUND)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
