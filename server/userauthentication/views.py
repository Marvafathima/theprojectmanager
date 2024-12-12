from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSignupSerializer, CustomTokenObtainPairSerializer

class SignupView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User created successfully",
                "user": UserSignupSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate and refresh the token
            response = super().post(request, *args, **kwargs)
            
            return response
        except Exception as e:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

class LogoutView(APIView):
    
    
    def post(self, request):
        try:
            # Get the refresh token from the request
            refresh_token = request.data.get('refresh_token')
            
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {"message": "Successfully logged out and token blacklisted"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Invalid refresh token or logout failed"},
                status=status.HTTP_400_BAD_REQUEST
            )