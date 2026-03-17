from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Coupon
from .serializers import CouponSerializer, ValidateCouponSerializer
from apps.users.permissions import IsAdminUser


class ValidateCouponView(APIView):
    """Public endpoint to validate a coupon code."""
    def post(self, request):
        serializer = ValidateCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            coupon = Coupon.objects.get(code=serializer.validated_data['code'])
            if not coupon.is_valid():
                return Response({'detail': 'Coupon is expired or inactive.'}, status=status.HTTP_400_BAD_REQUEST)

            subtotal = serializer.validated_data['subtotal']
            if subtotal < coupon.minimum_order:
                return Response({
                    'detail': f'Minimum order amount is PKR {coupon.minimum_order}.'
                }, status=status.HTTP_400_BAD_REQUEST)

            discount = coupon.calculate_discount(subtotal)
            return Response({
                'code': coupon.code,
                'discount_type': coupon.discount_type,
                'discount_value': coupon.discount_value,
                'discount_amount': discount,
                'description': coupon.description,
            })
        except Coupon.DoesNotExist:
            return Response({'detail': 'Invalid coupon code.'}, status=status.HTTP_404_NOT_FOUND)


# Admin CRUD
class AdminCouponListCreateView(generics.ListCreateAPIView):
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]
    queryset = Coupon.objects.all()
    search_fields = ['code', 'description']


class AdminCouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]
    queryset = Coupon.objects.all()
