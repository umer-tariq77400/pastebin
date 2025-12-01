from django.urls import include, path
from rest_framework.routers import DefaultRouter

from snippets import views

router = DefaultRouter()
router.register(r'snippets', views.SnippetViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'register', views.RegisterView, basename='register')

urlpatterns = [
    path('', include(router.urls)),
    path('current_user/', views.current_user),
]
