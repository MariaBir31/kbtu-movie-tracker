from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import  WatchEntry
from ..serializers import (LoginSerializer, RegisterSerializer,
                           WatchEntrySerializer)
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user=serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(
            {'message': 'Account was created successfully',**tokens},
            status=status.HTTP_201_CREATED

        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user=serializer.validated_data['user']
        tokens=get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token=request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message':'Logged out successfully'},status=status.HTTP_200_OK)
    except Exception:
        return Response({'error':'Invalid or expired token'},status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def watchlist_view(request):
    """
        GET  /trackerapp/watchlist/       — list current user's watch entries
        POST /trackerapp/watchlist/       — add a movie to the watch list
        Uses custom manager: WatchEntry.objects.for_user()
        """
    if request.method == 'GET':
        entries = WatchEntry.objects.for_user(request.user).select_related('movie','movie__added_by')
        serializer = WatchEntrySerializer(entries,many=True)
        return Response(serializer.data)
    serializer = WatchEntrySerializer(data=request.data,context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
def watchlist_detail_view(request,pk):
    """
        GET    /trackerapp/watchlist/<pk>/  — retrieve one entry
        PUT    /trackerapp/watchlist/<pk>/  — update status / rating / note
        DELETE /trackerapp/watchlist/<pk>/  — remove from watch list
        """
    try:
        entry = WatchEntry.objects.get(pk=pk, user=request.user)
    except WatchEntry.DoesNotExist:
        return Response({'error': 'Entry not found.'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(WatchEntrySerializer(entry).data)
    elif request.method == 'PUT':
        serializer = WatchEntrySerializer(entry,data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



