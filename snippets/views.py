import secrets
import string

from django.contrib.auth.models import User
from rest_framework import permissions, renderers, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from .ai_review import review_code
from .models import Snippet
from .serializers import RegisterSerializer, SnippetSerializer, UserSerializer


class SnippetViewSet(viewsets.ModelViewSet):
    serializer_class = SnippetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Snippet.objects.filter(owner=self.request.user)

    @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
    def highlight(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)

    @action(detail=True, methods=['post', 'get'], url_path='review')
    def review(self, request, *args, **kwargs):
        """
        Review the snippet code using AI.
        Only the owner can trigger this.
        """
        if request.method == 'GET':
             return Response({'detail': 'Send a POST request to review this snippet.'})

        snippet = self.get_object()

        # Double check owner (although get_queryset already filters by owner for standard actions,
        # explicitly checking is safer if access patterns change)
        if snippet.owner != request.user:
             return Response({'detail': 'You do not have permission to review this snippet.'}, status=status.HTTP_403_FORBIDDEN)

        review_result = review_code(snippet.code)
        return Response({'review': review_result})

    def perform_create(self, serializer):
        # Generate a random password for sharing if not provided
        shared_password = serializer.validated_data.get('shared_password')
        if not shared_password:
             alphabet = string.ascii_letters + string.digits
             shared_password = ''.join(secrets.choice(alphabet) for i in range(8))
             serializer.save(owner=self.request.user, shared_password=shared_password)
        else:
             serializer.save(owner=self.request.user)

    @action(detail=False, url_path='shared/(?P<uuid>[^/.]+)', methods=['post'])
    def retrieve_shared(self, request, uuid=None):
        """
        Retrieve a snippet by UUID and password.
        """
        try:
            snippet = Snippet.objects.get(uuid=uuid)
        except Snippet.DoesNotExist:
            return Response({'detail': 'Snippet not found.'}, status=status.HTTP_404_NOT_FOUND)

        # If user is owner, return without password check
        if request.user == snippet.owner:
             serializer = self.get_serializer(snippet)
             return Response(serializer.data)

        password = request.data.get('password')
        if not password:
            return Response({'detail': 'Password required.'}, status=status.HTTP_400_BAD_REQUEST)

        if snippet.shared_password == password:
             serializer = self.get_serializer(snippet)
             return Response(serializer.data)
        else:
             return Response({'detail': 'Incorrect password.'}, status=status.HTTP_403_FORBIDDEN)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own user object
        return User.objects.filter(id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        # Allow user to update their own profile
        user = self.get_object()
        if user != request.user:
            return Response({'detail': 'You can only edit your own profile.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Allow user to delete their own profile
        user = self.get_object()
        if user != request.user:
            return Response({'detail': 'You can only delete your own profile.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        # Allow user to create profile
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user, context={'request': request}) 
    return Response(serializer.data)


class RegisterViewSet(viewsets.GenericViewSet, viewsets.mixins.CreateModelMixin):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
