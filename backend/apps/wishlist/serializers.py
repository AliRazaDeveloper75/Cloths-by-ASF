from rest_framework import serializers
from .models import Wishlist
from apps.products.serializers import ProductListSerializer


class WishlistSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)
    count = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'products', 'count']

    def get_count(self, obj):
        return obj.products.count()
