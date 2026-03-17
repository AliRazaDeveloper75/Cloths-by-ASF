from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Wishlist
from .serializers import WishlistSerializer
from apps.products.models import Product


class WishlistView(APIView):
    def get_or_create_wishlist(self, user):
        wishlist, _ = Wishlist.objects.get_or_create(user=user)
        return wishlist

    def get(self, request):
        wishlist = self.get_or_create_wishlist(request.user)
        return Response(WishlistSerializer(wishlist, context={'request': request}).data)

    def post(self, request):
        """Toggle product in wishlist."""
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, pk=product_id, is_active=True)
        wishlist = self.get_or_create_wishlist(request.user)

        if product in wishlist.products.all():
            wishlist.products.remove(product)
            action = 'removed'
        else:
            wishlist.products.add(product)
            action = 'added'

        return Response({
            'action': action,
            'wishlist': WishlistSerializer(wishlist, context={'request': request}).data,
        })


class WishlistItemView(APIView):
    def delete(self, request, product_id):
        """Remove specific product from wishlist."""
        wishlist = get_object_or_404(Wishlist, user=request.user)
        product = get_object_or_404(Product, pk=product_id)
        wishlist.products.remove(product)
        return Response(WishlistSerializer(wishlist, context={'request': request}).data)
