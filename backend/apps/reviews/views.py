from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from apps.products.models import Product
from apps.users.permissions import IsAdminUser


class ProductReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product = get_object_or_404(Product, slug=self.kwargs['slug'])
        return Review.objects.filter(product=product, is_approved=True)


class CreateReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UpdateDeleteReviewView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)


class AdminReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminUser]
    queryset = Review.objects.all().select_related('user', 'product')
    filterset_fields = ['is_approved', 'rating']


class AdminApproveReviewView(generics.UpdateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminUser]
    queryset = Review.objects.all()

    def patch(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        review.is_approved = not review.is_approved
        review.save()
        return Response({'is_approved': review.is_approved})
