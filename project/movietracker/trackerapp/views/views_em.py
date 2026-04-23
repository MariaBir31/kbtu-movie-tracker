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
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_movie_rating(request, pk):
    try:
        entry = WatchEntry.objects.get(user=request.user, movie_id=pk)
        
        
        new_rating = request.data.get('rating')
        
        if new_rating is not None:
            entry.rating = new_rating
            entry.save()
            return Response({"message": "Rating updated", "rating": entry.rating})
        
        return Response({"error": "No rating provided"}, status=400)

    except WatchEntry.DoesNotExist:
        
        return Response({"error": "Entry not found. Add to watchlist first."}, status=404)
