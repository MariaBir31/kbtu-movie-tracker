from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Movie,WatchEntry,Review
from django.contrib.auth import authenticate
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    def validate(self,data):
        user=authenticate(username=data['username'],password=data['password'])
        if user is None:
            raise serializers.ValidationError({'Invalid Username or Password'})
        if not user.is_active:
            raise serializers.ValidationError({'This account has been disabled'})
        data['user']=user
        return data
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True,min_length=8)
    password2 = serializers.CharField(write_only=True,label='Confirm Password')
    def validate_username(self,value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError({'Username already exists'})
        return value
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError({'Email already exists'})
        return value
    def validate(self,data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'Passwords do not match'})
        return data
    def create(self,validated_data):
        validated_data.pop('password2')
        user=User.objects.create_user(username=validated_data['username'],email=validated_data['email'],password=validated_data['password'])
        return user
class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields=('id','username')
class MovieSerializer(serializers.ModelSerializer):
    added_by = UserSummarySerializer(read_only=True)
    class Meta:
        model = Movie
        fields='__all__'
        read_only_fields=('added_by','created_at')
class WatchEntrySerializer(serializers.ModelSerializer):
    user=serializers.HiddenField(default=serializers.CurrentUserDefault())
    movie = MovieSerializer(read_only=True)
    movie_id=serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all(),source='movie',write_only=True)
    class Meta:
        model = WatchEntry
        fields='__all__'
class ReviewSerializer(serializers.ModelSerializer):
    user=UserSummarySerializer(read_only=True)
    class Meta:
        model = Review
        fields='__all__'
        read_only_fields=('user','created_at')





