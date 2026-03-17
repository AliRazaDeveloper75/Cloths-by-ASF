from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'parent', 'subcategories', 'product_count', 'is_active']

    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.filter(is_active=True), many=True).data
        return []

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'value', 'stock', 'price_adjustment']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product listings."""
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    avg_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    effective_price = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description', 'category', 'category_name',
            'price', 'discount_price', 'effective_price', 'discount_percentage',
            'stock', 'in_stock', 'brand', 'is_featured',
            'avg_rating', 'review_count', 'primary_image', 'created_at',
        ]

    def get_primary_image(self, obj):
        request = self.context.get('request')
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img and request:
            return request.build_absolute_uri(img.image.url)
        return None

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer with all related data."""
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    avg_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    effective_price = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = '__all__'


# Admin write serializers
class ProductWriteSerializer(serializers.ModelSerializer):
    # ── Optional fields ──────────────────────────────────────────────────────
    # validators=[] disables DRF's auto-attached UniqueValidator for sku so we
    # can handle blank → auto-generate logic ourselves in validate_sku().
    sku               = serializers.CharField(required=False, allow_blank=True, default='', validators=[])
    brand             = serializers.CharField(required=False, allow_blank=True, default='')
    short_description = serializers.CharField(required=False, allow_blank=True, default='')
    discount_price    = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    weight            = serializers.DecimalField(max_digits=6,  decimal_places=2, required=False, allow_null=True)
    category          = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )
    # id included read-only so the create response carries the new product's id
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'short_description', 'category',
            'price', 'discount_price', 'stock', 'sku', 'brand',
            'weight', 'is_active', 'is_featured',
        ]

    # ── SKU validation ───────────────────────────────────────────────────────
    def _generate_unique_sku(self):
        import uuid
        while True:
            candidate = f"AFS-{uuid.uuid4().hex[:6].upper()}"
            if not Product.objects.filter(sku=candidate).exists():
                return candidate

    def validate_sku(self, value):
        """Auto-generate when blank; otherwise validate uniqueness manually."""
        if not value:
            return self._generate_unique_sku()
        # Manual uniqueness check — exclude current instance on updates
        qs = Product.objects.filter(sku=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('A product with this SKU already exists.')
        return value

    def update(self, instance, validated_data):
        # Never blank-out an existing SKU — keep it if admin left field empty
        if not validated_data.get('sku'):
            validated_data.pop('sku', None)
        return super().update(instance, validated_data)


class CategoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'description', 'image', 'parent', 'is_active']
