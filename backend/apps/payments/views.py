from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Payment
from .serializers import PaymentSerializer
from apps.orders.models import Order


class CreateStripePaymentIntentView(APIView):
    """Create a Stripe PaymentIntent for online checkout (optional feature)."""
    def post(self, request):
        if not settings.STRIPE_SECRET_KEY:
            return Response(
                {'detail': 'Online payment is not configured on this server. Please use Cash on Delivery.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        order_id = request.data.get('order_id')
        order = get_object_or_404(Order, pk=order_id, user=request.user)

        if order.is_paid:
            return Response({'detail': 'Order is already paid.'}, status=status.HTTP_400_BAD_REQUEST)

        if order.payment_method != 'online':
            return Response({'detail': 'Order payment method is not online.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            import stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY

            intent = stripe.PaymentIntent.create(
                amount=int(order.total * 100),  # Stripe uses smallest currency unit
                currency='pkr',
                metadata={'order_id': order.id, 'order_number': order.order_number},
            )

            # Create/update payment record
            Payment.objects.update_or_create(
                order=order,
                defaults={
                    'amount': order.total,
                    'payment_method': 'stripe',
                    'stripe_payment_intent': intent.id,
                    'status': 'pending',
                }
            )

            return Response({
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id,
            })
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ConfirmPaymentView(APIView):
    """Confirm payment after successful Stripe charge."""
    def post(self, request):
        order_id = request.data.get('order_id')
        payment_intent_id = request.data.get('payment_intent_id')

        order = get_object_or_404(Order, pk=order_id, user=request.user)

        try:
            payment = Payment.objects.get(order=order, stripe_payment_intent=payment_intent_id)
            payment.status = 'completed'
            payment.save()

            order.is_paid = True
            order.paid_at = timezone.now()
            order.status = 'confirmed'
            order.payment_status = 'paid'
            order.save()

            # Clear the cart now that payment is confirmed
            from apps.cart.models import Cart
            try:
                Cart.objects.get(user=request.user).items.all().delete()
            except Cart.DoesNotExist:
                pass

            return Response({'detail': 'Payment confirmed.', 'order_number': order.order_number})
        except Payment.DoesNotExist:
            return Response({'detail': 'Payment record not found.'}, status=status.HTTP_400_BAD_REQUEST)


class StripeWebhookView(APIView):
    """Handle Stripe webhook events (production use)."""
    permission_classes = []  # No auth for webhooks

    def post(self, request):
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'payment_intent.succeeded':
            intent = event['data']['object']
            order_id = intent['metadata'].get('order_id')
            if order_id:
                try:
                    order = Order.objects.get(pk=order_id)
                    order.is_paid = True
                    order.paid_at = timezone.now()
                    order.status = 'confirmed'
                    order.save()

                    payment, _ = Payment.objects.get_or_create(order=order)
                    payment.status = 'completed'
                    payment.transaction_id = intent['id']
                    payment.save()
                except Order.DoesNotExist:
                    pass

        return Response({'received': True})
