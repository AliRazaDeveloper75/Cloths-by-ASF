from django.urls import path
from .views import (
    LoginView, RegisterView, LogoutView, ProfileView,
    ChangePasswordView, PasswordResetRequestView, PasswordResetConfirmView,
    ShippingAddressListCreateView, ShippingAddressDetailView,
    AdminUserListView, AdminUserDetailView, AdminBlockUserView, AdminPromoteUserView,
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    # Shipping addresses
    path('addresses/', ShippingAddressListCreateView.as_view(), name='addresses'),
    path('addresses/<int:pk>/', ShippingAddressDetailView.as_view(), name='address-detail'),

    # Admin
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:pk>/block/', AdminBlockUserView.as_view(), name='admin-block-user'),
    path('admin/users/<int:pk>/promote/', AdminPromoteUserView.as_view(), name='admin-promote-user'),
]
