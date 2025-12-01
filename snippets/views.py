from django.contrib.auth.models import User
from rest_framework import permissions, renderers, viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from .models import Snippet
from .permissions import IsOwnerOrReadOnly
from .serializers import RegisterSerializer, SnippetSerializer, UserSerializer


class SnippetViewSet(viewsets.ModelViewSet):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
    def highlight(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)

    def perform_create(self, serializer):
        # Generate a random password for sharing if not provided?
        # Actually the model allows blank=True, but user requirements say "In the share modal they will see a share link and a password".
        # So we should probably generate one if it's empty.
        import secrets
        import string

        shared_password = serializer.validated_data.get('shared_password')
        if not shared_password:
             alphabet = string.ascii_letters + string.digits
             shared_password = ''.join(secrets.choice(alphabet) for i in range(8))
             # We need to save it. But perform_create saves the serializer.
             # We can't easily modify validated_data here for the serializer save without re-validating?
             # Actually `save` accepts kwargs.
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
    # Changed from ReadOnlyModelViewSet to ModelViewSet to allow updates,
    # but we should restrict permissions.
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can see all users or just themselves? Default was all.
        return User.objects.all()

    def update(self, request, *args, **kwargs):
        # Allow user to update their own profile
        user = self.get_object()
        if user != request.user:
            return Response({'detail': 'You can only edit your own profile.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
         return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user, context={'request': request}) 
    return Response(serializer.data)


class RegisterView(viewsets.GenericViewSet, viewsets.mixins.CreateModelMixin):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
