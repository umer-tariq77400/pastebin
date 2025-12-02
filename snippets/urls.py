from django.urls import include, path
from rest_framework.routers import DefaultRouter

from snippets import views

router = DefaultRouter()
router.register(r'snippets', views.SnippetViewSet, basename='snippet')
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.RegisterViewSet.as_view({'post': 'create'}), name='register'),
    path('current_user/', views.current_user),
]
