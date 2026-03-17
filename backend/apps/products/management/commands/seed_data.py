"""
Management command to seed the database with sample data.
Run: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.products.models import Category, Product
from apps.coupons.models import Coupon
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # Create superuser
        if not User.objects.filter(email='admin@clothbyafs.com').exists():
            User.objects.create_superuser(
                email='admin@clothbyafs.com',
                password='Admin@1234',
                first_name='AFS',
                last_name='Admin',
            )
            self.stdout.write(self.style.SUCCESS('Created admin user: admin@clothbyafs.com / Admin@1234'))

        # Create test customer
        if not User.objects.filter(email='customer@test.com').exists():
            User.objects.create_user(
                email='customer@test.com',
                password='Test@1234',
                first_name='Test',
                last_name='Customer',
            )
            self.stdout.write(self.style.SUCCESS('Created test customer: customer@test.com / Test@1234'))

        # Categories
        cats = {}
        for name in ['Men', 'Women', 'Kids', 'Accessories']:
            cat, _ = Category.objects.get_or_create(name=name, defaults={'is_active': True})
            cats[name] = cat

        subcats = {
            'Men': ['Shirts', 'Pants', 'Suits', 'Casual Wear'],
            'Women': ['Dresses', 'Tops', 'Abayas', 'Casual Wear'],
            'Kids': ['Boys', 'Girls', 'Infant'],
            'Accessories': ['Bags', 'Belts', 'Scarves'],
        }
        for parent_name, children in subcats.items():
            for child_name in children:
                Category.objects.get_or_create(
                    name=child_name,
                    defaults={'parent': cats[parent_name], 'is_active': True}
                )

        # Sample products
        products_data = [
            {'name': 'Classic White Shirt', 'category': 'Shirts', 'price': 1200, 'stock': 50, 'is_featured': True,
             'description': 'Premium quality cotton white shirt, perfect for formal occasions.'},
            {'name': 'Slim Fit Trousers', 'category': 'Pants', 'price': 2500, 'discount_price': 1999, 'stock': 30,
             'description': 'Elegant slim fit trousers made from high quality fabric.'},
            {'name': 'Floral Maxi Dress', 'category': 'Dresses', 'price': 3500, 'discount_price': 2800, 'stock': 25, 'is_featured': True,
             'description': 'Beautiful floral pattern maxi dress for every occasion.'},
            {'name': 'Embroidered Abaya', 'category': 'Abayas', 'price': 5000, 'stock': 15, 'is_featured': True,
             'description': 'Exquisite hand-embroidered abaya with premium fabric.'},
            {'name': 'Kids Casual Set', 'category': 'Boys', 'price': 1500, 'discount_price': 1200, 'stock': 40,
             'description': 'Comfortable and stylish casual set for boys.'},
            {'name': "Girls' Party Frock", 'category': 'Girls', 'price': 2000, 'stock': 20, 'is_featured': True,
             'description': 'Adorable party frock for girls with lace detailing.'},
            {'name': 'Leather Handbag', 'category': 'Bags', 'price': 4500, 'discount_price': 3800, 'stock': 10,
             'description': 'Genuine leather handbag with multiple compartments.'},
            {'name': 'Formal Business Suit', 'category': 'Suits', 'price': 12000, 'discount_price': 9999, 'stock': 8, 'is_featured': True,
             'description': 'Premium two-piece formal business suit.'},
        ]

        for p_data in products_data:
            cat_name = p_data.pop('category')
            try:
                cat = Category.objects.get(name=cat_name)
                Product.objects.get_or_create(
                    name=p_data['name'],
                    defaults={**p_data, 'category': cat, 'brand': 'Cloth by AFS', 'short_description': p_data['description'][:100]}
                )
            except Category.DoesNotExist:
                pass

        self.stdout.write(self.style.SUCCESS(f'Created {len(products_data)} sample products'))

        # Coupons
        Coupon.objects.get_or_create(
            code='WELCOME10',
            defaults={
                'description': '10% off for new customers',
                'discount_type': 'percentage',
                'discount_value': 10,
                'minimum_order': 1000,
                'valid_until': timezone.now() + timedelta(days=365),
                'is_active': True,
            }
        )
        Coupon.objects.get_or_create(
            code='SAVE500',
            defaults={
                'description': 'PKR 500 off on orders above PKR 3000',
                'discount_type': 'fixed',
                'discount_value': 500,
                'minimum_order': 3000,
                'valid_until': timezone.now() + timedelta(days=365),
                'is_active': True,
            }
        )

        self.stdout.write(self.style.SUCCESS('Created sample coupons: WELCOME10, SAVE500'))
        self.stdout.write(self.style.SUCCESS('✅ Seeding complete!'))
