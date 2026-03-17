from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'user_name', 'user_avatar', 'rating', 'title', 'comment', 'is_approved', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'is_approved']

    def get_user_name(self, obj):
        return obj.user.full_name

    def get_user_avatar(self, obj):
        request = self.context.get('request')
        if obj.user.avatar and request:
            return request.build_absolute_uri(obj.user.avatar.url)
        return None

    def validate_product(self, product):
        request = self.context.get('request')
        if request and Review.objects.filter(product=product, user=request.user).exists():
            raise serializers.ValidationError('You have already reviewed this product.')
        return product
