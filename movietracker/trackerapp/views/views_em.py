from django.db.models import Avg, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import WatchEntry,Movie
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movie_rating(request, pk):
    try:
        movie = Movie.objects.get(pk=pk)
    except Movie.DoesNotExist:
        return Response({'error': 'Movie not found'}, status=404)

    stats = WatchEntry.objects.filter(movie=movie).aggregate(
        avg_rating=Avg('rating'),
        count=Count('rating')
    )

    return Response({
        "movie": movie.title,
        "avg_rating": stats['avg_rating'] or 0,
        "ratings_count": stats['count']
    })