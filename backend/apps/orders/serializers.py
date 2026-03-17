from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'variant', 'product_name', 'product_image',
            'variant_info', 'unit_price', 'quantity', 'line_total',
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

    def get_user_name(self, obj):
        return obj.user.full_name if obj.user else None


class PlaceOrderSerializer(serializers.Serializer):
    shipping_address_id = serializers.IntegerField(required=False)

    # Or provide address directly
    shipping_full_name = serializers.CharField(required=False)
    shipping_phone = serializers.CharField(required=False)
    shipping_address_line1 = serializers.CharField(required=False)
    shipping_address_line2 = serializers.CharField(required=False, allow_blank=True)
    shipping_city = serializers.CharField(required=False)
    shipping_state = serializers.CharField(required=False)
    shipping_postal_code = serializers.CharField(required=False)
    shipping_country = serializers.CharField(required=False, default='Pakistan')

    # cod = Cash on Delivery (default, primary)
    # online = Stripe card payment (optional — only works when Stripe keys are configured)
    payment_method = serializers.ChoiceField(choices=['cod', 'online'], default='cod')
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)


class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    ])
    tracking_number = serializers.CharField(required=False, allow_blank=True)
