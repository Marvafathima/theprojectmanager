from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSignupSerializer(serializers.ModelSerializer):
    """
    Serializer for user signup. Validates and creates a new user.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])  # Password field with validation
    password2 = serializers.CharField(write_only=True, required=True)  # Confirmation password field

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'password2', 'role', 'profile_pic')
        extra_kwargs = {
            'email': {'required': True},  # Email is required
            'username': {'required': True},  # Username is required
            'role': {'required': True}  # Role is required
        }

    def validate(self, attrs):
        """
        Ensure the password and confirmation password match.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        """
        Create a new user after removing the confirmation password field.
        """
        validated_data.pop('password2')  # Remove the password2 field as it's not needed for user creation
        user = User.objects.create_user(**validated_data)  # Create the user using the model's create_user method
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for obtaining JWT tokens. Adds user details to the token response.
    """
    def validate(self, attrs):
        """
        Validate user credentials and include additional user information in the response.
        """
        data = super().validate(attrs)  # Perform default validation
        user_data = {
            'id': self.user.id,  # User ID
            'email': self.user.email,  # User email
            'username': self.user.username,  # Username
            'role': self.user.role if self.user.role else 'admin',  # User role, defaults to 'admin' if not set
            'joined_at': self.user.joined_at,  # User's join date
        }
        if self.user.profile_pic:
            user_data['profile_pic'] = self.user.profile_pic.url  # Include profile picture URL if available
        data['user'] = user_data  # Add user data to the response
        return data


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for basic user information.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'profile_pic']  # Fields to include in the serialized output

# User = get_user_model()

# class UserSignupSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
#     password2 = serializers.CharField(write_only=True, required=True)

#     class Meta:
#         model = User
#         fields = ('id','email', 'username', 'password', 'password2', 
#                  'role', 'profile_pic')
#         extra_kwargs = {
#             'email': {'required': True},
#             'username': {'required': True},
#             'role': {'required': True}
#         }

#     def validate(self, attrs):
#         if attrs['password'] != attrs['password2']:
#             raise serializers.ValidationError({"password": "Password fields didn't match."})
#         return attrs

#     def create(self, validated_data):
#         validated_data.pop('password2')
#         user = User.objects.create_user(**validated_data)
        
#         return user
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
#         # Add extra responses here
#         user_data={
#             'id': self.user.id,
#             'email': self.user.email,
#             'username': self.user.username,
#             'role': self.user.role if self.user.role else 'admin' ,
#             'joined_at': self.user.joined_at,

#         }
#         if self.user.profile_pic:
#             user_data['profile_pic'] = self.user.profile_pic.url
#         data['user']=user_data
#         return data
    

# class CustomUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'username', 'profile_pic']