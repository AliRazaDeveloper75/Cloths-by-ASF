from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer
from apps.products.models import Product, ProductVariant


class CartView(APIView):
    def get_or_create_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_or_create_cart(request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """Add item to cart."""
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = self.get_or_create_cart(request.user)
        product = get_object_or_404(Product, pk=serializer.validated_data['product_id'], is_active=True)
        variant_id = serializer.validated_data.get('variant_id')
        variant = None
        if variant_id:
            variant = get_object_or_404(ProductVariant, pk=variant_id, product=product)

        quantity = serializer.validated_data['quantity']

        # Check stock
        available = variant.stock if variant else product.stock
        if available < quantity:
            return Response({'detail': f'Only {available} items in stock.'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, variant=variant,
            defaults={'quantity': quantity},
        )
        if not created:
            new_qty = cart_item.quantity + quantity
            if available < new_qty:
                return Response({'detail': f'Only {available} items in stock.'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = new_qty
            cart_item.save()

        return Response(CartSerializer(cart, context={'request': request}).data)

    def delete(self, request):
        """Clear the entire cart."""
        cart = self.get_or_create_cart(request.user)
        cart.items.all().delete()
        return Response({'detail': 'Cart cleared.'})


class CartItemView(APIView):
    def patch(self, request, item_id):
        """Update cart item quantity."""
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item = get_object_or_404(CartItem, pk=item_id, cart__user=request.user)
        available = item.variant.stock if item.variant else item.product.stock
        new_qty = serializer.validated_data['quantity']

        if available < new_qty:
            return Response({'detail': f'Only {available} items in stock.'}, status=status.HTTP_400_BAD_REQUEST)

        item.quantity = new_qty
        item.save()
        return Response(CartSerializer(item.cart, context={'request': request}).data)

    def delete(self, request, item_id):
        """Remove item from cart."""
        item = get_object_or_404(CartItem, pk=item_id, cart__user=request.user)
        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart, context={'request': request}).data)
