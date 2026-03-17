from django.urls import path
from .views import (
    ProductReviewListView, CreateReviewView, UpdateDeleteReviewView,
    AdminReviewListView, AdminApproveReviewView,
)

urlpatterns = [
    path('products/<slug:slug>/reviews/', ProductReviewListView.as_view(), name='product-reviews'),
    path('', CreateReviewView.as_view(), name='create-review'),
    path('<int:pk>/', UpdateDeleteReviewView.as_view(), name='review-detail'),

    # Admin
    path('admin/reviews/', AdminReviewListView.as_view(), name='admin-review-list'),
    path('admin/reviews/<int:pk>/approve/', AdminApproveReviewView.as_view(), name='admin-approve-review'),
]
