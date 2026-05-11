from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer
from .models import User
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin
from rest_framework import status

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "user created"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({
            "name": user.name,
            "email": user.email,
            "role": user.role
        })
class UsersListView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):

        users = User.objects.all()

        data = [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role
            }
            for u in users
        ]

        return Response(data)
# Create your views here.
