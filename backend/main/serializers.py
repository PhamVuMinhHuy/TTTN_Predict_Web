from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):
    Username = serializers.CharField(max_length=50)
    Password = serializers.CharField(write_only=True)
    Email = serializers.EmailField(required=False, allow_blank=True)
    Name = serializers.CharField(max_length=100, required=False, allow_blank=True)
