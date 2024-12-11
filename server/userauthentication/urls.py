# from django.urls import path
# from .views import SignupView,CustomTokenObtainPairView,LogoutView

# urlpatterns = [
#  path('signup/', SignupView.as_view(), name='signup'),
#  path('api/token/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
#  path('logout/', LogoutView.as_view(), name='logout'),
# ]
from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import (
    SignupView, 
    CustomTokenObtainPairView, 
    CustomTokenRefreshView, 
    LogoutView
)

urlpatterns = [
    # Signup
    path('signup/', SignupView.as_view(), name='signup'),
    
    # Token endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Logout
    path('logout/', LogoutView.as_view(), name='logout'),
]