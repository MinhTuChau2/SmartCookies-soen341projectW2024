from django.urls import path
from . import views

urlpatterns = [
    path('branches/', views.BranchDetailView.as_view(), name='branch-list'),
]