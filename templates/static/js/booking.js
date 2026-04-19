/**
 * booking.js — Waste Pickup Booking Page
 *
 * Sections:
 *  1. Map setup (Leaflet)
 *  2. Date picker
 *  3. Time slots
 *  4. Pricing calculator
 *  5. Payment method switcher
 *  6. Card number formatter
 *  7. UPI verification
 *  8. Booking confirmation modal
 */


/* ─────────────────────────────────────────────
   1. MAP SETUP
   Leaflet map centred on Kochi with sample
   disposal facility markers.
───────────────────────────────────────────── */

const FACTORIES = [
    {
        id: 1,
        name: "GreenCycle Kochi",
        type: "Recycling",
        color: "#2d9e5f",
        lat: 9.9312,
        lng: 76.2673,
        address: "Edapally, Kochi",
        accepts: "Recyclables, E-Waste",
        open: "Mon–Sat 8AM–6PM",
        distance: "2.4 km"
    },
    {
        id: 2,
        name: "SafeDispose Centre",
        type: "Hazardous",
        color: "#e67e22",
        lat: 9.9195,
        lng: 76.2598,
        address: "Kaloor, Kochi",
        accepts: "Hazardous, Medical Waste",
        open: "Mon–Fri 9AM–5PM",
        distance: "3.8 km"
    },
    {
        id: 3,
        name: "BioCompost Hub",
        type: "Composting",
        color: "#3498db",
        lat: 9.9457,
        lng: 76.2800,
        address: "Kalamassery, Kochi",
        accepts: "Organic, Garden Waste",
        open: "Daily 7AM–7PM",
        distance: "4.1 km"
    },
    {
        id: 4,
        name: "Kerala Waste Authority",
        type: "General",
        color: "#9b59b6",
        lat: 9.9058,
        lng: 76.2780,
        address: "Thripunithura, Kochi",
        accepts: "All types",
        open: "Mon–Sat 8AM–5PM",
        distance: "5.6 km"
    },
    {
        id: 5,
        name: "EcoPark Recyclers",
        type: "Recycling",
        color: "#2d9e5f",
        lat: 10.0020,
        lng: 76.3100,
        address: "Aluva, Ernakulam",
        accepts: "Recyclables, Bulk",
        open: "Daily 6AM–8PM",
        distance: "8.2 km"
    },
    {
        id: 6,
        name: "CleanTech Kochi",
        type: "General",
        color: "#9b59b6",
        lat: 9.8850,
        lng: 76.2470,
        address: "Maradu, Kochi",
        accepts: "General, Bulk",
        open: "Mon–Sat 9AM–6PM",
        distance: "6.7 km"
    }
];

function buildCircleIcon(color) {
    return L.divIcon({
        className: '',
        html: `<div style="
            width: 22px;
            height: 22px;
            background: ${color};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.30);
        "></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -14]
    });
}

function buildUserIcon() {
    return L.divIcon({
        className: '',
        html: `<div style="
            width: 16px;
            height: 16px;
            background: #1a6b3c;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 6px rgba(26, 107, 60, 0.25);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
}

function buildPopupHTML(factory) {
    return `
        <div class="popup-title">${factory.name}</div>
        <div class="popup-type">${factory.type} Facility</div>
        <div style="font-size:12px; color:#5a7a65; margin-bottom:4px;">📍 ${factory.address}</div>
        <div style="font-size:12px; color:#5a7a65; margin-bottom:4px;">✅ ${factory.accepts}</div>
        <div style="font-size:12px; color:#5a7a65; margin-bottom:6px;">🕐 ${factory.open}</div>
        <div class="popup-distance">🚗 ${factory.distance} away</div>
        <button class="popup-select-btn"
            onclick="selectFactory(${factory.id}, '${factory.name}', '${factory.distance}')">
            Select This Factory
        </button>
    `;
}

function initMap() {
    const map = L.map('ecomap', {
        center: [9.9312, 76.2673],
        zoom: 12,
        zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // User's location marker
    L.marker([9.9312, 76.2673], { icon: buildUserIcon() })
        .addTo(map)
        .bindPopup('<div class="popup-title">📍 Your Location</div>')
        .openPopup();

    // Factory markers
    FACTORIES.forEach(factory => {
        L.marker([factory.lat, factory.lng], { icon: buildCircleIcon(factory.color) })
            .addTo(map)
            .bindPopup(buildPopupHTML(factory));
    });
}

function selectFactory(id, name, distance) {
    document.getElementById('factory_id_input').value = id;
    document.getElementById('selected-factory-name').textContent = `${name} · ${distance} away`;
    document.getElementById('selected-factory-display').classList.add('visible');
    document.getElementById('sum-factory').textContent = name;

    // Close the popup after selecting
    document.querySelectorAll('.leaflet-popup-close-button').forEach(btn => btn.click());
}


/* ─────────────────────────────────────────────
   2. DATE PICKER
   Set the minimum selectable date to today
   and sync the order summary display.
───────────────────────────────────────────── */

function formatDateForSummary(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function initDatePicker() {
    const input = document.getElementById('pickup_date');
    const today = new Date().toISOString().split('T')[0];

    input.setAttribute('min', today);
    input.value = today;

    document.getElementById('sum-date').textContent = formatDateForSummary(today);

    input.addEventListener('change', e => {
        document.getElementById('sum-date').textContent = formatDateForSummary(e.target.value);
    });
}


/* ─────────────────────────────────────────────
   3. TIME SLOTS
   Highlight the selected slot and keep the
   hidden input in sync.
───────────────────────────────────────────── */

function initTimeSlots() {
    document.querySelectorAll('.slot-btn:not(.unavailable)').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('time_slot_input').value = btn.dataset.slot;
            document.getElementById('sum-slot').textContent = btn.textContent.trim();
        });
    });
}


/* ─────────────────────────────────────────────
   4. PRICING CALCULATOR
   Recalculates total whenever the user changes
   waste type, weight, or payment method.
───────────────────────────────────────────── */

const WASTE_PRICES = {
    general:    0,
    recyclable: 30,
    organic:    20,
    ewaste:     80,
    hazardous:  150,
    bulk:       100
};

const WEIGHT_PRICES = {
    '0-10':   0,
    '10-50':  50,
    '50-200': 120,
    '200+':   250
};

const BASE_FEE     = 149;
const GREEN_DISCOUNT = 20;
const COD_FEE      = 20;

function recalcPrice() {
    let wasteSurcharge = 0;
    const selectedTypes = [];

    document.querySelectorAll('.waste-option input:checked').forEach(checkbox => {
        wasteSurcharge += WASTE_PRICES[checkbox.value] || 0;
        const label = checkbox.nextElementSibling.querySelector('.w-name').textContent;
        selectedTypes.push(label);
    });

    const weight = document.getElementById('weight').value;
    const weightSurcharge = WEIGHT_PRICES[weight] || 0;
    const totalSurcharge = wasteSurcharge + weightSurcharge;

    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    const codFee = paymentMethod === 'cod' ? COD_FEE : 0;

    const total = BASE_FEE + totalSurcharge - GREEN_DISCOUNT + codFee;

    document.getElementById('sum-waste').textContent    = selectedTypes.join(', ') || 'None';
    document.getElementById('sum-weight').textContent   = weight + ' kg';
    document.getElementById('sum-base').textContent     = '₹ ' + BASE_FEE;
    document.getElementById('sum-surcharge').textContent = '₹ ' + totalSurcharge;
    document.getElementById('sum-total').textContent    = '₹ ' + total;
}

function initPricing() {
    document.querySelectorAll('.waste-option input').forEach(cb => {
        cb.addEventListener('change', recalcPrice);
    });

    document.getElementById('weight').addEventListener('change', e => {
        document.getElementById('sum-weight').textContent = e.target.value + ' kg';
        recalcPrice();
    });

    document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
        radio.addEventListener('change', recalcPrice);
    });

    recalcPrice();
}


/* ─────────────────────────────────────────────
   5. PAYMENT METHOD SWITCHER
   Shows the relevant payment panel and updates
   the summary label when a method is selected.
───────────────────────────────────────────── */

const PAYMENT_LABELS = {
    card:       'Card',
    upi:        'UPI',
    netbanking: 'Net Banking',
    cod:        'Cash on Day'
};

function initPaymentSwitcher() {
    document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.querySelectorAll('.pay-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById('panel-' + this.value).classList.add('active');
            document.getElementById('sum-payment').textContent = PAYMENT_LABELS[this.value] || this.value;
        });
    });
}


/* ─────────────────────────────────────────────
   6. CARD NUMBER FORMATTER
   Formats card input as "1234 5678 9012 3456"
───────────────────────────────────────────── */

function initCardFormatter() {
    document.getElementById('card-num-input').addEventListener('input', function () {
        const digits = this.value.replace(/\D/g, '').substring(0, 16);
        this.value = digits.replace(/(.{4})/g, '$1 ').trim();
    });
}


/* ─────────────────────────────────────────────
   7. UPI VERIFICATION
   Demo verification with a simulated delay.
───────────────────────────────────────────── */

function verifyUPI() {
    const upiId = document.getElementById('upi_id').value.trim();
    const statusEl = document.getElementById('upi-status');

    if (!upiId.includes('@')) {
        statusEl.style.color = '#c0392b';
        statusEl.textContent = '✗ Invalid UPI ID format.';
        return;
    }

    statusEl.style.color = 'var(--text-muted)';
    statusEl.textContent = 'Verifying…';

    setTimeout(() => {
        statusEl.style.color = 'var(--green-deep)';
        statusEl.textContent = '✓ UPI ID verified successfully.';
    }, 1200);
}


/* ─────────────────────────────────────────────
   8. BOOKING CONFIRMATION
   Validates required fields, generates a
   booking ID, and shows the success modal.
───────────────────────────────────────────── */

function generateBookingId() {
    return 'ECO-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function confirmBooking() {
    const name    = document.getElementById('full_name').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const date    = document.getElementById('pickup_date').value;

    if (!name || !phone || !address || !date) {
        alert('Please fill in all required fields before confirming.');
        return;
    }

    document.getElementById('booking-id').textContent = generateBookingId();
    document.getElementById('success-modal').classList.add('open');
}


/* ─────────────────────────────────────────────
   INIT — run everything on page load
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initDatePicker();
    initTimeSlots();
    initPricing();
    initPaymentSwitcher();
    initCardFormatter();
});
