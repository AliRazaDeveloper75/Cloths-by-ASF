"""
Centralized HTML email utilities for Cloth by AFS.
All emails use inline CSS for maximum email-client compatibility.
"""
import datetime
from django.core.mail import send_mail
from django.conf import settings

# ── Brand tokens ──────────────────────────────────────────────
PRIMARY  = '#f09c27'
DARK     = '#0f172a'
BG       = '#f1f5f9'
CARD     = '#ffffff'
TEXT     = '#374151'
MUTED    = '#6b7280'
BORDER   = '#e5e7eb'
SUCCESS  = '#16a34a'
INFO     = '#2563eb'
DANGER   = '#ef4444'

SITE_NAME    = 'Cloth by AFS'
WHATSAPP_NUM = '+92 313 4001623'


def _frontend(path=''):
    return f"{settings.FRONTEND_URL}{path}"


# ── Reusable fragments ────────────────────────────────────────

def _btn(label, url, bg=PRIMARY, color=DARK):
    return (
        f'<a href="{url}" style="display:inline-block;background:{bg};color:{color};'
        f'text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;'
        f'border-radius:10px;letter-spacing:0.3px;">{label}</a>'
    )


def _divider():
    return f'<div style="border-top:1px solid {BORDER};margin:28px 0;"></div>'


def _base(content, preheader=''):
    year = datetime.date.today().year
    pre = (
        f'<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">'
        f'{preheader}&nbsp;' * 3
        f'</div>'
        if preheader else ''
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>{SITE_NAME}</title>
</head>
<body style="margin:0;padding:0;background:{BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
{pre}
<table width="100%" cellpadding="0" cellspacing="0" style="background:{BG};padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background:{DARK};border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
    <div style="height:3px;background:linear-gradient(90deg,{PRIMARY},#e07b00,{PRIMARY});border-radius:2px;margin-bottom:20px;"></div>
    <a href="{_frontend()}" style="text-decoration:none;">
      <span style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">{SITE_NAME}</span>
    </a>
    <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;letter-spacing:0.5px;">PREMIUM PAKISTANI FASHION</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:{CARD};padding:40px;border-left:1px solid {BORDER};border-right:1px solid {BORDER};">
    {content}
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:{DARK};border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
    <p style="margin:0 0 10px;color:#475569;font-size:12px;">
      <a href="{_frontend('/products')}" style="color:#64748b;text-decoration:none;margin:0 10px;">Shop</a>
      <a href="{_frontend('/about')}"    style="color:#64748b;text-decoration:none;margin:0 10px;">About</a>
      <a href="{_frontend('/contact')}"  style="color:#64748b;text-decoration:none;margin:0 10px;">Contact</a>
    </p>
    <p style="margin:0;color:#334155;font-size:12px;">
      &copy; {year} {SITE_NAME}. All rights reserved. Made with love in Pakistan.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>"""


# ═══════════════════════════════════════════════════════════════
# 1. WELCOME EMAIL  (sent on registration)
# ═══════════════════════════════════════════════════════════════

def send_welcome_email(user):
    name = user.first_name or 'Valued Customer'

    content = f"""
    <h1 style="margin:0 0 4px;font-size:28px;font-weight:800;color:{DARK};">Welcome, {name}! 🎉</h1>
    <p style="margin:0 0 24px;color:{PRIMARY};font-size:15px;font-weight:600;">Your account is ready. Let's get shopping!</p>

    <p style="margin:0 0 20px;color:{TEXT};font-size:15px;line-height:1.75;">
      Thank you for joining <strong>{SITE_NAME}</strong> — Pakistan's premier online fashion destination.
      We're thrilled to have you as part of our family!
    </p>

    {_divider()}

    <!-- About Us card -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:24px 28px;">
      <h2 style="margin:0 0 12px;font-size:17px;font-weight:700;color:{DARK};">Who We Are</h2>
      <p style="margin:0 0 14px;color:{TEXT};font-size:14px;line-height:1.75;">
        Cloth by AFS brings you the finest Pakistani fashion — from classic shalwar kameez and luxury kurtis
        to modern abayas and casual wear — all crafted with premium fabric and meticulous attention to detail.
        Every stitch tells a story of quality and tradition.
      </p>
      <table cellpadding="0" cellspacing="0">
        <tr><td style="padding:4px 0;color:{TEXT};font-size:14px;">&#9989;&nbsp; 100% authentic Pakistani designs</td></tr>
        <tr><td style="padding:4px 0;color:{TEXT};font-size:14px;">&#128666;&nbsp; Nationwide delivery &amp; Cash on Delivery</td></tr>
        <tr><td style="padding:4px 0;color:{TEXT};font-size:14px;">&#128260;&nbsp; 7-day hassle-free returns &amp; exchanges</td></tr>
        <tr><td style="padding:4px 0;color:{TEXT};font-size:14px;">&#128274;&nbsp; Secure checkout &amp; encrypted payments</td></tr>
        <tr><td style="padding:4px 0;color:{TEXT};font-size:14px;">&#127873;&nbsp; Exclusive member deals &amp; new arrival alerts</td></tr>
      </table>
    </td></tr>
    </table>

    {_divider()}

    <!-- Welcome offer -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:linear-gradient(135deg,{DARK} 0%,#1e3a5f 100%);border-radius:12px;padding:24px 28px;text-align:center;">
      <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Exclusive Welcome Gift</p>
      <p style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:800;">10% OFF Your First Order</p>
      <div style="display:inline-block;background:{PRIMARY};color:{DARK};font-weight:800;font-size:18px;
                  padding:8px 24px;border-radius:8px;letter-spacing:2px;font-family:monospace;">
        WELCOME10
      </div>
      <p style="margin:10px 0 0;color:#94a3b8;font-size:12px;">Apply at checkout. One-time use.</p>
    </td></tr>
    </table>

    {_divider()}

    <p style="margin:0 0 20px;color:{TEXT};font-size:15px;">
      Ready to explore our latest collection?
    </p>
    <div style="text-align:center;">
      {_btn('&#128717;  Start Shopping Now', _frontend('/products'))}
    </div>

    {_divider()}

    <p style="margin:0;color:{MUTED};font-size:13px;line-height:1.7;text-align:center;">
      Need help? We're always here for you.<br/>
      &#128222; WhatsApp: <strong>{WHATSAPP_NUM}</strong> &nbsp;|&nbsp;
      <a href="{_frontend('/contact')}" style="color:{PRIMARY};">Contact Support</a>
    </p>
    """

    plain = (
        f"Hi {name},\n\n"
        f"Welcome to Cloth by AFS!\n\n"
        f"Your account has been created successfully.\n\n"
        f"WHO WE ARE\n"
        f"Cloth by AFS brings you the finest Pakistani fashion — classic shalwar kameez,\n"
        f"luxury kurtis, modern abayas, and casual wear — all with premium quality.\n\n"
        f"✅ Authentic Pakistani designs\n"
        f"🚚 Nationwide delivery & Cash on Delivery\n"
        f"🔁 7-day returns & exchanges\n"
        f"🔒 Secure checkout\n\n"
        f"WELCOME OFFER\n"
        f"Use code WELCOME10 for 10% off your first order!\n\n"
        f"Start shopping: {_frontend('/products')}\n\n"
        f"Need help? WhatsApp: {WHATSAPP_NUM}\n\n"
        f"— Team Cloth by AFS"
    )

    send_mail(
        subject=f'Welcome to Cloth by AFS, {name}! 🎉',
        message=plain,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=_base(content, preheader=f"Welcome {name}! Use WELCOME10 for 10% off your first order."),
        fail_silently=True,
    )


# ═══════════════════════════════════════════════════════════════
# 2. ORDER CONFIRMATION EMAIL  (sent when order is placed)
# ═══════════════════════════════════════════════════════════════

def send_order_confirmation_email(order):
    user = order.user
    name = user.first_name or 'Valued Customer'
    is_cod = order.payment_method == 'cod'

    status_label = 'Order Confirmed ✅' if is_cod else 'Awaiting Payment ⏳'
    status_color = SUCCESS if is_cod else INFO
    payment_note = (
        'Your order is confirmed. Our team will contact you before delivery.'
        if is_cod else
        'Please complete your online payment. Your items are reserved for 24 hours.'
    )

    # Items table rows
    items_html = ''
    items_plain = ''
    for item in order.items.all():
        variant = (
            f'<br/><span style="color:{MUTED};font-size:12px;">{item.variant_info}</span>'
            if item.variant_info else ''
        )
        items_html += f"""
        <tr>
          <td style="padding:14px 8px 14px 0;border-bottom:1px solid {BORDER};
                     color:{TEXT};font-size:14px;line-height:1.5;">
            <strong>{item.product_name}</strong>{variant}
          </td>
          <td style="padding:14px 8px;border-bottom:1px solid {BORDER};
                     color:{MUTED};font-size:14px;text-align:center;white-space:nowrap;">
            &times;{item.quantity}
          </td>
          <td style="padding:14px 0 14px 8px;border-bottom:1px solid {BORDER};
                     color:{DARK};font-size:14px;font-weight:700;text-align:right;white-space:nowrap;">
            PKR {item.line_total:,.0f}
          </td>
        </tr>"""
        items_plain += f"  {item.product_name} x{item.quantity} = PKR {item.line_total:,.0f}\n"
        if item.variant_info:
            items_plain += f"    ({item.variant_info})\n"

    # Discount row
    discount_html = ''
    if order.discount_amount:
        code = f' ({order.coupon_code})' if order.coupon_code else ''
        discount_html = f"""
        <tr>
          <td colspan="2" style="padding:6px 0;color:{SUCCESS};font-size:14px;">
            Discount{code}
          </td>
          <td style="padding:6px 0;color:{SUCCESS};font-size:14px;font-weight:700;text-align:right;">
            &minus; PKR {order.discount_amount:,.0f}
          </td>
        </tr>"""

    shipping_label   = 'Free Shipping &#127881;' if order.shipping_cost == 0 else 'Shipping'
    shipping_display = 'FREE' if order.shipping_cost == 0 else f'PKR {order.shipping_cost:,.0f}'
    shipping_color   = SUCCESS if order.shipping_cost == 0 else TEXT

    track_url = _frontend(f'/orders/{order.id}')

    addr2 = f'<br/>{order.shipping_address_line2}' if order.shipping_address_line2 else ''

    content = f"""
    <!-- Status banner -->
    <div style="background:{status_color}18;border:1px solid {status_color}55;border-radius:10px;
                padding:14px 20px;margin-bottom:28px;">
      <span style="color:{status_color};font-size:15px;font-weight:700;">{status_label}</span>
    </div>

    <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:{DARK};">Hi {name},</h1>
    <p style="margin:0 0 6px;color:{TEXT};font-size:15px;line-height:1.6;">
      Your order has been successfully placed.
    </p>
    <p style="margin:0 0 28px;color:{MUTED};font-size:14px;line-height:1.6;">{payment_note}</p>

    <!-- Order meta -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="background:{BG};border-radius:10px;padding:4px 0;margin-bottom:28px;">
      <tr>
        <td style="padding:9px 18px;font-size:13px;color:{MUTED};">Order Number</td>
        <td style="padding:9px 18px;font-size:13px;color:{DARK};font-weight:800;text-align:right;">
          #{order.order_number}
        </td>
      </tr>
      <tr>
        <td style="padding:9px 18px;font-size:13px;color:{MUTED};">Date</td>
        <td style="padding:9px 18px;font-size:13px;color:{DARK};text-align:right;">
          {order.created_at.strftime('%d %B %Y, %I:%M %p')}
        </td>
      </tr>
      <tr>
        <td style="padding:9px 18px;font-size:13px;color:{MUTED};">Payment</td>
        <td style="padding:9px 18px;font-size:13px;color:{DARK};text-align:right;">
          {order.get_payment_method_display()}
        </td>
      </tr>
    </table>

    <!-- Items -->
    <h3 style="margin:0 0 16px;font-size:16px;font-weight:700;color:{DARK};">Order Items</h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <th style="text-align:left;padding-bottom:10px;font-size:11px;color:{MUTED};
                   text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid {BORDER};">
          Item
        </th>
        <th style="text-align:center;padding-bottom:10px;font-size:11px;color:{MUTED};
                   text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid {BORDER};">
          Qty
        </th>
        <th style="text-align:right;padding-bottom:10px;font-size:11px;color:{MUTED};
                   text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid {BORDER};">
          Price
        </th>
      </tr>
      {items_html}
      <!-- Subtotal -->
      <tr>
        <td colspan="2" style="padding:12px 0 4px;color:{MUTED};font-size:14px;">Subtotal</td>
        <td style="padding:12px 0 4px;color:{DARK};font-size:14px;text-align:right;">
          PKR {order.subtotal:,.0f}
        </td>
      </tr>
      <!-- Shipping -->
      <tr>
        <td colspan="2" style="padding:4px 0;color:{MUTED};font-size:14px;">{shipping_label}</td>
        <td style="padding:4px 0;color:{shipping_color};font-size:14px;font-weight:700;text-align:right;">
          {shipping_display}
        </td>
      </tr>
      {discount_html}
      <!-- Total -->
      <tr>
        <td colspan="2" style="padding:14px 0 0;border-top:2px solid {DARK};
                                color:{DARK};font-size:17px;font-weight:800;">
          Total
        </td>
        <td style="padding:14px 0 0;border-top:2px solid {DARK};
                   color:{PRIMARY};font-size:18px;font-weight:800;text-align:right;">
          PKR {order.total:,.0f}
        </td>
      </tr>
    </table>

    {_divider()}

    <!-- Shipping address -->
    <h3 style="margin:0 0 12px;font-size:16px;font-weight:700;color:{DARK};">Delivery Address</h3>
    <div style="background:{BG};border-radius:10px;padding:16px 20px;
                font-size:14px;color:{TEXT};line-height:1.8;">
      <strong>{order.shipping_full_name}</strong><br/>
      {order.shipping_phone}<br/>
      {order.shipping_address_line1}{addr2}<br/>
      {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}<br/>
      {order.shipping_country}
    </div>

    {_divider()}

    <div style="text-align:center;margin-bottom:24px;">
      {_btn('&#128230; Track My Order', track_url)}
    </div>

    {_divider()}

    <p style="margin:0;color:{MUTED};font-size:13px;line-height:1.7;text-align:center;">
      Questions? WhatsApp us at <strong>{WHATSAPP_NUM}</strong><br/>
      or visit our <a href="{_frontend('/contact')}" style="color:{PRIMARY};">support page</a>.
    </p>
    """

    plain = (
        f"Hi {name},\n\n"
        f"Order #{order.order_number} has been placed!\n"
        f"Status: {status_label}\n"
        f"Date: {order.created_at.strftime('%d %B %Y')}\n\n"
        f"ITEMS:\n{items_plain}\n"
        f"Subtotal : PKR {order.subtotal:,.0f}\n"
        f"Shipping : {shipping_display}\n"
        + (f"Discount : -PKR {order.discount_amount:,.0f}\n" if order.discount_amount else '')
        + f"TOTAL    : PKR {order.total:,.0f}\n\n"
        f"Payment  : {order.get_payment_method_display()}\n"
        f"{payment_note}\n\n"
        f"Track your order: {track_url}\n\n"
        f"Need help? WhatsApp: {WHATSAPP_NUM}\n"
        f"— Team Cloth by AFS"
    )

    send_mail(
        subject=f'Order #{order.order_number} {"Confirmed ✅" if is_cod else "Placed ⏳"} – Cloth by AFS',
        message=plain,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=_base(
            content,
            preheader=f"Order #{order.order_number} placed! Total: PKR {order.total:,.0f}"
        ),
        fail_silently=True,
    )


# ═══════════════════════════════════════════════════════════════
# 3. ORDER STATUS UPDATE EMAIL  (sent when admin changes status)
# ═══════════════════════════════════════════════════════════════

_STATUS_META = {
    'pending':    {'label': 'Order Received',   'icon': '&#128336;', 'color': '#f59e0b',
                   'desc': 'We have received your order and are reviewing it.'},
    'confirmed':  {'label': 'Order Confirmed',  'icon': '&#9989;',   'color': SUCCESS,
                   'desc': 'Great news! Your order has been confirmed and is being prepared.'},
    'processing': {'label': 'Being Prepared',   'icon': '&#127981;', 'color': '#8b5cf6',
                   'desc': 'Your items are being carefully packed and quality-checked.'},
    'shipped':    {'label': 'On the Way!',       'icon': '&#128666;', 'color': INFO,
                   'desc': 'Your order is out for delivery. Expect it in 2–5 business days.'},
    'delivered':  {'label': 'Delivered!',        'icon': '&#127881;', 'color': SUCCESS,
                   'desc': 'Your order has been delivered. We hope you love it!'},
    'cancelled':  {'label': 'Order Cancelled',  'icon': '&#10060;',  'color': DANGER,
                   'desc': 'Your order has been cancelled. If you paid online, a refund will be initiated within 3–5 business days.'},
    'refunded':   {'label': 'Refund Processed', 'icon': '&#128184;', 'color': INFO,
                   'desc': 'Your refund has been processed. It may take 3–5 business days to reflect in your account.'},
}

_PROGRESS_STEPS = ['confirmed', 'processing', 'shipped', 'delivered']


def send_order_status_email(order):
    user = order.user
    name = user.first_name or 'Valued Customer'
    meta = _STATUS_META.get(
        order.status,
        {'label': order.status.title(), 'icon': '&#128203;', 'color': PRIMARY, 'desc': ''}
    )
    track_url = _frontend(f'/orders/{order.id}')

    # ── Progress stepper (for main fulfilment statuses) ──────
    progress_html = ''
    if order.status in _PROGRESS_STEPS:
        current_idx = _PROGRESS_STEPS.index(order.status)
        cells = ''
        for i, s in enumerate(_PROGRESS_STEPS):
            sm = _STATUS_META[s]
            if i < current_idx:
                dot_bg, dot_color, lbl_color, dot_text = SUCCESS, '#fff', SUCCESS, '&#10003;'
            elif i == current_idx:
                dot_bg, dot_color, lbl_color, dot_text = meta['color'], '#fff', meta['color'], sm['icon']
            else:
                dot_bg, dot_color, lbl_color, dot_text = BORDER, MUTED, MUTED, str(i + 1)

            cells += f"""
            <td style="text-align:center;width:25%;padding:0 4px;">
              <div style="width:36px;height:36px;border-radius:50%;background:{dot_bg};
                          margin:0 auto 8px;display:table-cell;vertical-align:middle;
                          text-align:center;color:{dot_color};font-weight:700;font-size:14px;">
                {dot_text}
              </div>
              <div style="font-size:11px;color:{lbl_color};font-weight:{'700' if i == current_idx else '400'};
                          line-height:1.3;">
                {sm['label']}
              </div>
            </td>"""

        progress_html = f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>{cells}</tr>
        </table>"""

    # ── Tracking number block ─────────────────────────────────
    tracking_html = ''
    if order.tracking_number:
        tracking_html = f"""
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;
                    padding:16px;margin:20px 0;text-align:center;">
          <p style="margin:0 0 4px;color:{MUTED};font-size:11px;text-transform:uppercase;
                    letter-spacing:0.5px;font-weight:600;">Tracking Number</p>
          <p style="margin:0;color:{INFO};font-size:20px;font-weight:800;font-family:monospace;">
            {order.tracking_number}
          </p>
        </div>"""

    # ── Delivered: invite review ──────────────────────────────
    review_html = ''
    if order.status == 'delivered':
        review_html = f"""
        {_divider()}
        <div style="text-align:center;">
          <p style="font-size:16px;font-weight:700;color:{DARK};margin:0 0 8px;">
            How did we do? &#11088;
          </p>
          <p style="color:{MUTED};font-size:14px;margin:0 0 20px;">
            Leave a review and help other shoppers discover great fashion.
          </p>
          {_btn('Write a Review', track_url)}
        </div>"""

    # ── Order summary rows ────────────────────────────────────
    shipped_row = ''
    if order.shipped_at:
        shipped_row = f"""
        <tr>
          <td style="padding:7px 18px;font-size:13px;color:{MUTED};">Shipped On</td>
          <td style="padding:7px 18px;font-size:13px;color:{DARK};text-align:right;">
            {order.shipped_at.strftime('%d %B %Y')}
          </td>
        </tr>"""

    delivered_row = ''
    if order.delivered_at:
        delivered_row = f"""
        <tr>
          <td style="padding:7px 18px;font-size:13px;color:{MUTED};">Delivered On</td>
          <td style="padding:7px 18px;font-size:13px;color:{SUCCESS};font-weight:700;text-align:right;">
            {order.delivered_at.strftime('%d %B %Y')} &#9989;
          </td>
        </tr>"""

    content = f"""
    <!-- Status icon & headline -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:52px;line-height:1;margin-bottom:12px;">{meta['icon']}</div>
      <h1 style="margin:0 0 6px;font-size:24px;font-weight:800;color:{DARK};">{meta['label']}</h1>
      <p style="margin:0;color:{MUTED};font-size:14px;">Order #{order.order_number}</p>
    </div>

    {progress_html}

    <!-- Status message -->
    <div style="background:{meta['color']}18;border-left:4px solid {meta['color']};
                border-radius:0 10px 10px 0;padding:14px 18px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:13px;color:{MUTED};">Hi {name},</p>
      <p style="margin:0;color:{TEXT};font-size:14px;line-height:1.6;font-weight:500;">
        {meta['desc']}
      </p>
    </div>

    {tracking_html}

    <!-- Order summary -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="background:{BG};border-radius:10px;padding:4px 0;margin-bottom:24px;">
      <tr>
        <td style="padding:7px 18px;font-size:13px;color:{MUTED};">Order Total</td>
        <td style="padding:7px 18px;font-size:13px;color:{PRIMARY};font-weight:800;text-align:right;">
          PKR {order.total:,.0f}
        </td>
      </tr>
      <tr>
        <td style="padding:7px 18px;font-size:13px;color:{MUTED};">Payment</td>
        <td style="padding:7px 18px;font-size:13px;color:{DARK};text-align:right;">
          {order.get_payment_method_display()}
        </td>
      </tr>
      <tr>
        <td style="padding:7px 18px;font-size:13px;color:{MUTED};">Payment Status</td>
        <td style="padding:7px 18px;font-size:13px;font-weight:700;text-align:right;
                   color:{'#16a34a' if order.is_paid else MUTED};">
          {'Paid &#9989;' if order.is_paid else 'Pending'}
        </td>
      </tr>
      {shipped_row}
      {delivered_row}
    </table>

    <div style="text-align:center;">
      {_btn('&#128230; View Order Details', track_url)}
    </div>

    {review_html}

    {_divider()}

    <p style="margin:0;color:{MUTED};font-size:13px;line-height:1.7;text-align:center;">
      Need help? WhatsApp: <strong>{WHATSAPP_NUM}</strong><br/>
      <a href="{_frontend('/contact')}" style="color:{PRIMARY};">Contact Support</a>
    </p>
    """

    plain = (
        f"Hi {name},\n\n"
        f"Update on Order #{order.order_number}\n"
        f"Status: {meta['label']}\n\n"
        f"{meta['desc']}\n\n"
        + (f"Tracking Number: {order.tracking_number}\n\n" if order.tracking_number else '')
        + f"Order Total: PKR {order.total:,.0f}\n"
        f"Payment: {order.get_payment_method_display()} — {'Paid' if order.is_paid else 'Pending'}\n\n"
        f"View order: {track_url}\n\n"
        f"WhatsApp: {WHATSAPP_NUM}\n"
        f"— Team Cloth by AFS"
    )

    send_mail(
        subject=f'{meta["icon"]} Order #{order.order_number} – {meta["label"]} | Cloth by AFS',
        message=plain,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=_base(
            content,
            preheader=f"Order #{order.order_number}: {meta['label']} – Cloth by AFS"
        ),
        fail_silently=True,
    )
