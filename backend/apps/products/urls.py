from django.urls import path
from .views import (
    CategoryListView, ProductListView, ProductDetailView, FeaturedProductsView,
    AdminProductListCreateView, AdminProductDetailView, AdminProductImageView,
    AdminCategoryListCreateView, AdminCategoryDetailView, AdminVariantView,
)

urlpatterns = [
    # Public
    path('', ProductListView.as_view(), name='product-list'),
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),

    # Admin
    path('admin/products/', AdminProductListCreateView.as_view(), name='admin-product-list'),
    path('admin/products/<int:pk>/', AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('admin/products/<int:pk>/images/', AdminProductImageView.as_view(), name='admin-product-images'),
    path('admin/products/<int:pk>/variants/', AdminVariantView.as_view(), name='admin-product-variants'),
    path('admin/categories/', AdminCategoryListCreateView.as_view(), name='admin-category-list'),
    path('admin/categories/<int:pk>/', AdminCategoryDetailView.as_view(), name='admin-category-detail'),
]
