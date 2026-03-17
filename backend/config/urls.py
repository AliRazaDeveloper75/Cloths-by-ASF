from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions


def health(request):
    html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cloth by AFS — Backend</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
         background:#0f172a;color:#e2e8f0;min-height:100vh;
         display:flex;align-items:center;justify-content:center}
    .card{background:#1e293b;border:1px solid #334155;border-radius:16px;
          padding:40px 48px;max-width:540px;width:90%;text-align:center}
    .dot{display:inline-block;width:12px;height:12px;background:#22c55e;
         border-radius:50%;margin-right:8px;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    h1{font-size:1.75rem;font-weight:700;color:#f8fafc;margin:16px 0 6px}
    .sub{color:#94a3b8;font-size:.95rem;margin-bottom:28px}
    .links{display:flex;flex-direction:column;gap:10px}
    a{display:block;padding:12px 20px;border-radius:10px;
      text-decoration:none;font-size:.9rem;font-weight:500;transition:.2s}
    .primary{background:#f09c27;color:#0f172a}
    .primary:hover{background:#e07b00}
    .ghost{border:1px solid #475569;color:#94a3b8}
    .ghost:hover{background:#334155;color:#f8fafc}
    .badge{display:inline-flex;align-items:center;background:#0f172a;
           border:1px solid #334155;border-radius:999px;
           padding:4px 14px;font-size:.8rem;color:#64748b;margin-bottom:24px}
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span>Server is running</div>
    <h1>Cloth by AFS</h1>
    <p class="sub">Django REST API &mdash; Production Backend</p>
    <div class="links">
      <a class="primary" href="/api/docs/">Browse API Docs (Swagger)</a>
      <a class="ghost"   href="/api/redoc/">ReDoc Reference</a>
      <a class="ghost"   href="/admin/">Django Admin Panel</a>
    </div>
  </div>
</body>
</html>"""
    return HttpResponse(html)

schema_view = get_schema_view(
    openapi.Info(
        title="Cloth by AFS API",
        default_version='v1',
        description="Full-featured E-Commerce API for Cloth by AFS",
        contact=openapi.Contact(email="admin@clothbyafs.com"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('', health, name='health'),
    path('admin/', admin.site.urls),

    # API v1
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/products/', include('apps.products.urls')),
    path('api/v1/cart/', include('apps.cart.urls')),
    path('api/v1/wishlist/', include('apps.wishlist.urls')),
    path('api/v1/orders/', include('apps.orders.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
    path('api/v1/coupons/', include('apps.coupons.urls')),
    path('api/v1/reviews/', include('apps.reviews.urls')),

    # JWT token refresh
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Swagger docs
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
