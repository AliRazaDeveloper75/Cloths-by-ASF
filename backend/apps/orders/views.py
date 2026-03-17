from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings as django_settings

from .models import Order, OrderItem
from .serializers import OrderSerializer, PlaceOrderSerializer, UpdateOrderStatusSerializer
from apps.cart.models import Cart
from apps.users.models import ShippingAddress
from apps.coupons.models import Coupon
from apps.users.permissions import IsAdminUser


def _build_ship_data(data):
    """Extract shipping fields from validated serializer data."""
    return {k: data.get(k, '') for k in [
        'shipping_full_name', 'shipping_phone', 'shipping_address_line1',
        'shipping_address_line2', 'shipping_city', 'shipping_state',
        'shipping_postal_code', 'shipping_country',
    ]}


class PlaceOrderView(APIView):
    def post(self, request):
        serializer = PlaceOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        payment_method = data.get('payment_method', 'cod')

        # --- Validate online payment availability ---
        if payment_method == 'online':
            if not django_settings.STRIPE_SECRET_KEY:
                return Response(
                    {'payment_method': 'Online payment is not configured. Please choose Cash on Delivery.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # --- Get cart ---
        try:
            cart = Cart.objects.prefetch_related('items__product', 'items__variant').get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        if not cart.items.exists():
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Resolve shipping address ---
        if data.get('shipping_address_id'):
            addr = get_object_or_404(ShippingAddress, pk=data['shipping_address_id'], user=request.user)
            ship_data = {
                'shipping_full_name': addr.full_name,
                'shipping_phone': addr.phone,
                'shipping_address_line1': addr.address_line1,
                'shipping_address_line2': addr.address_line2,
                'shipping_city': addr.city,
                'shipping_state': addr.state,
                'shipping_postal_code': addr.postal_code,
                'shipping_country': addr.country,
            }
        else:
            required = ['shipping_full_name', 'shipping_phone', 'shipping_address_line1',
                        'shipping_city', 'shipping_state', 'shipping_postal_code']
            for field in required:
                if not data.get(field):
                    return Response({field: 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)
            ship_data = _build_ship_data(data)

        # --- Pricing ---
        subtotal = cart.subtotal
        shipping_cost = 200 if subtotal < 2000 else 0  # Free shipping over PKR 2,000
        discount_amount = 0
        coupon_code = data.get('coupon_code', '')
        coupon = None

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, is_active=True)
                if not coupon.is_valid():
                    return Response({'coupon_code': 'Coupon is expired or inactive.'}, status=status.HTTP_400_BAD_REQUEST)
                if coupon.max_uses and coupon.used_count >= coupon.max_uses:
                    return Response({'coupon_code': 'Coupon usage limit reached.'}, status=status.HTTP_400_BAD_REQUEST)
                discount_amount = coupon.calculate_discount(subtotal)
            except Coupon.DoesNotExist:
                return Response({'coupon_code': 'Invalid coupon code.'}, status=status.HTTP_400_BAD_REQUEST)

        total = subtotal + shipping_cost - discount_amount

        # --- Determine initial payment status ---
        # COD  → payment_status='pending'  (pay on delivery, confirmed immediately)
        # Online → payment_status='awaiting_payment' (cart held, paid after Stripe)
        if payment_method == 'cod':
            initial_order_status = 'confirmed'   # COD orders are confirmed right away
            initial_payment_status = 'pending'   # Will be collected on delivery
            initial_is_paid = False
        else:
            initial_order_status = 'pending'         # Held until payment succeeds
            initial_payment_status = 'awaiting_payment'
            initial_is_paid = False

        # --- Create order ---
        order = Order.objects.create(
            user=request.user,
            **ship_data,
            status=initial_order_status,
            payment_method=payment_method,
            payment_status=initial_payment_status,
            is_paid=initial_is_paid,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            discount_amount=discount_amount,
            total=total,
            coupon_code=coupon_code,
            notes=data.get('notes', ''),
        )

        # --- Create order items & deduct stock ---
        for cart_item in cart.items.select_related('product', 'variant'):
            if cart_item.variant:
                cart_item.variant.stock = max(0, cart_item.variant.stock - cart_item.quantity)
                cart_item.variant.save()
            else:
                cart_item.product.stock = max(0, cart_item.product.stock - cart_item.quantity)
                cart_item.product.save()

            primary_image = (
                cart_item.product.images.filter(is_primary=True).first()
                or cart_item.product.images.first()
            )
            image_url = primary_image.image.url if primary_image else ''

            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                product_name=cart_item.product.name,
                product_image=image_url,
                variant_info=(
                    f"{cart_item.variant.name}: {cart_item.variant.value}"
                    if cart_item.variant else ''
                ),
                unit_price=cart_item.unit_price,
                quantity=cart_item.quantity,
            )

        # --- Coupon usage count ---
        if coupon:
            coupon.used_count += 1
            coupon.save()

        # --- Clear cart (for COD; for online keep until payment confirmed) ---
        if payment_method == 'cod':
            cart.items.all().delete()

        # --- Confirmation email ---
        try:
            payment_note = (
                "Your order will be paid on delivery."
                if payment_method == 'cod'
                else "Please complete your online payment to confirm the order."
            )
            send_mail(
                subject=f'Order #{order.order_number} – {"Confirmed" if payment_method == "cod" else "Awaiting Payment"}',
                message=(
                    f"Hi {request.user.first_name},\n\n"
                    f"Your order #{order.order_number} has been placed!\n"
                    f"Total: PKR {order.total}\n"
                    f"Payment: {order.get_payment_method_display()}\n"
                    f"{payment_note}\n\n"
                    f"Track at: {django_settings.FRONTEND_URL}/orders/{order.id}\n\n"
                    f"Thank you for shopping with Cloth by AFS!"
                ),
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.user.email],
                fail_silently=True,
            )
        except Exception:
            pass

        response_data = OrderSerializer(order).data
        # For online payment, return a flag so frontend can redirect to payment
        response_data['requires_payment'] = (payment_method == 'online')
        return Response(response_data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class CancelOrderView(APIView):
    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        if order.status not in ['pending', 'confirmed']:
            return Response(
                {'detail': 'Order cannot be cancelled at this stage.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = 'cancelled'
        order.save()

        # Restore stock
        for item in order.items.select_related('product', 'variant'):
            if item.variant:
                item.variant.stock += item.quantity
                item.variant.save()
            elif item.product:
                item.product.stock += item.quantity
                item.product.save()

        # Restore cart items if online payment was never completed
        if order.payment_method == 'online' and not order.is_paid:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            from apps.cart.models import CartItem
            for item in order.items.select_related('product', 'variant'):
                CartItem.objects.get_or_create(
                    cart=cart, product=item.product, variant=item.variant,
                    defaults={'quantity': item.quantity},
                )

        return Response(OrderSerializer(order).data)


# ── Admin views ──────────────────────────────────────────────────────────────

class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['status', 'payment_method', 'payment_status', 'is_paid']
    search_fields = ['order_number', 'user__email', 'shipping_full_name']
    ordering_fields = ['created_at', 'total']

    def get_queryset(self):
        return Order.objects.all().prefetch_related('items').select_related('user')


class AdminOrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all().prefetch_related('items').select_related('user')


class AdminUpdateOrderStatusView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']
        order.status = new_status

        if serializer.validated_data.get('tracking_number'):
            order.tracking_number = serializer.validated_data['tracking_number']

        if new_status == 'shipped' and not order.shipped_at:
            order.shipped_at = timezone.now()
        elif new_status == 'delivered' and not order.delivered_at:
            order.delivered_at = timezone.now()
            # COD: mark as paid when delivered
            if order.payment_method == 'cod' and not order.is_paid:
                order.is_paid = True
                order.paid_at = timezone.now()
                order.payment_status = 'paid'

        order.save()
        return Response(OrderSerializer(order).data)


class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.db.models import Sum, Count
        from django.contrib.auth import get_user_model
        from apps.products.models import Product

        User = get_user_model()
        orders = Order.objects.all()

        # Revenue = confirmed COD (delivered) + completed online payments
        total_revenue = orders.filter(is_paid=True).aggregate(Sum('total'))['total__sum'] or 0
        total_orders = orders.count()
        pending_orders = orders.filter(status='pending').count()
        total_users = User.objects.filter(role='customer').count()
        total_products = Product.objects.filter(is_active=True).count()

        from django.db.models.functions import TruncMonth
        from datetime import timedelta
        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_revenue = (
            orders
            .filter(is_paid=True, created_at__gte=six_months_ago)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(revenue=Sum('total'), count=Count('id'))
            .order_by('month')
        )

        recent_orders = OrderSerializer(
            orders.order_by('-created_at')[:10], many=True
        ).data

        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'total_users': total_users,
            'total_products': total_products,
            'monthly_revenue': list(monthly_revenue),
            'recent_orders': recent_orders,
        })
