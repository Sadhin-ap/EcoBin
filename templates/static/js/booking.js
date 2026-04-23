
/* ── Constants ───────────────────────────────────────── */
const BASE_FEE = 149;
const GREEN_DISCOUNT = 20;
const COD_FEE = 20;

const WASTE_PRICES = {
  general: 0,
  recyclable: 30,
  organic: 20,
  ewaste: 80,
  hazardous: 150,
  bulk: 100,
};

const WEIGHT_PRICES = {
  '0-10': 0,
  '10-50': 50,
  '50-200': 120,
  '200+': 250,
};

const PAYMENT_LABELS = {
  card: 'Card',
  upi: 'UPI',
  netbanking: 'Net Banking',
  cod: 'Cash on Day',
};

/* ── Map ───────────────────────────────────────── */
const USER_LOCATION = { lat: 11.2588, lng: 75.7804 };

function initMap() {
  const map = L.map('ecomap').setView([USER_LOCATION.lat, USER_LOCATION.lng], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(map);

  L.marker([USER_LOCATION.lat, USER_LOCATION.lng]).addTo(map)
    .bindPopup("📍 Your Location")
    .openPopup();
}

/* ── Date ───────────────────────────────────────── */
function initDatePicker() {
  const input = document.getElementById('pickup_date');
  const today = new Date().toISOString().split('T')[0];

  input.min = today;
  input.value = today;
}

/* ── Pricing ───────────────────────────────────────── */
function recalcPrice() {
  let surcharge = 0;

  document.querySelectorAll('.waste-option input:checked').forEach(cb => {
    surcharge += WASTE_PRICES[cb.value] || 0;
  });

  const weight = document.getElementById('weight').value;
  surcharge += WEIGHT_PRICES[weight] || 0;

  const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
  const codFee = paymentMethod === 'cod' ? COD_FEE : 0;

  const total = BASE_FEE + surcharge - GREEN_DISCOUNT + codFee;

  document.getElementById('sum-total').textContent = "₹ " + total;
}

/* ── Payment Switch ───────────────────────────────────────── */
function initPaymentSwitcher() {
  document.querySelectorAll('input[name="payment_method"]').forEach(r => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.pay-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + r.value).classList.add('active');
    });
  });
}

/* ── Razorpay Payment ───────────────────────────────────────── */
function confirmBooking() {
  const name = document.getElementById('full_name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();

  if (!name || !phone || !address) {
    alert("Fill all fields");
    return;
  }

  let totalText = document.getElementById('sum-total').textContent;
  let amount = parseInt(totalText.replace(/[^\d]/g, ''));

  var options = {
    "key": "rzp_test_3726", 
    "amount": amount * 100,
    "currency": "INR",
    "name": "EcoBin",
    "description": "Waste Pickup Payment",

    "handler": function (response) {
      document.getElementById('booking-id').textContent =
        'ECO-' + Math.random().toString(36).substr(2, 6).toUpperCase();

      document.getElementById('success-modal').classList.remove('hidden');
    },

    "prefill": {
      "name": name,
      "contact": phone
    },

    "theme": {
      "color": "#2d9e5f"
    }
  };

  var rzp = new Razorpay(options);
  rzp.open();
}

/* ── Init ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initDatePicker();
  initPaymentSwitcher();

  document.querySelectorAll('.waste-option input').forEach(cb => {
    cb.addEventListener('change', recalcPrice);
  });

  document.getElementById('weight').addEventListener('change', recalcPrice);

  recalcPrice();
});