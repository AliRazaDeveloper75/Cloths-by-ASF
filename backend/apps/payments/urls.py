from django.urls import path
from .views import CreateStripePaymentIntentView, ConfirmPaymentView, StripeWebhookView

urlpatterns = [
    path('create-intent/', CreateStripePaymentIntentView.as_view(), name='create-payment-intent'),
    path('confirm/', ConfirmPaymentView.as_view(), name='confirm-payment'),
    path('webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
]
