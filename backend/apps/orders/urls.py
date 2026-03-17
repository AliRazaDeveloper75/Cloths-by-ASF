from django.urls import path
from .views import (
    PlaceOrderView, OrderListView, OrderDetailView, CancelOrderView,
    AdminOrderListView, AdminOrderDetailView, AdminUpdateOrderStatusView,
    AdminDashboardStatsView,
)

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('place/', PlaceOrderView.as_view(), name='place-order'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:pk>/cancel/', CancelOrderView.as_view(), name='cancel-order'),

    # Admin
    path('admin/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/<int:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('admin/<int:pk>/status/', AdminUpdateOrderStatusView.as_view(), name='admin-order-status'),
    path('admin/dashboard/', AdminDashboardStatsView.as_view(), name='admin-dashboard'),
]
