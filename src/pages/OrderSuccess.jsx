import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";
import qrcode from "../assets/qrcode.jpg";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [items, setItems] = useState([]);

  const [paymentForm, setPaymentForm] = useState({
    sender_name: "",
    sender_account: "",
  });

  const [showQrModal, setShowQrModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  const [paymentToast, setPaymentToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelToast, setCancelToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  // =========================
  // FETCH ORDER DATA
  // =========================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        // Ambil data pesanan
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderError) {
          throw orderError;
        }

        setOrder(orderData);

        // Ambil data pembayaran
        const { data: paymentData, error: paymentError } = await supabase
          .from("payments")
          .select("*")
          .eq("order_id", orderData.id)
          .maybeSingle();

        if (paymentError) {
          throw paymentError;
        }

        setPayment(paymentData);

        // Ambil detail item pesanan
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select(`
            *,
            products (
              name,
              image
            )
          `)
          .eq("order_id", orderData.id);

        if (itemsError) {
          throw itemsError;
        }

        setItems(itemsData || []);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  // =========================
  // COPY NOMOR PESANAN
  // =========================
  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.order_number);

      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
      }, 2500);
    } catch (error) {
      console.error("Gagal menyalin nomor pesanan:", error);
    }
  };

  // =========================
  // HANDLE INPUT PAYMENT
  // =========================
  const handlePaymentInput = (e) => {
    const { name, value } = e.target;

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
// HANDLE KONFIRMASI PEMBAYARAN
// =========================
const handleConfirmPayment = async () => {
  try {
    if (!payment) return;

    // Validasi transfer & QRIS
    if (
      payment.payment_method !== "cash" &&
      (
        !paymentForm.sender_name.trim() ||
        !paymentForm.sender_account.trim()
      )
    ) {
      setPaymentToast({
        show: true,
        type: "error",
        message: "Lengkapi nama pengirim dan nomor rekening.",
      });

      setTimeout(() => {
        setPaymentToast((prev) => ({
          ...prev,
          show: false,
        }));
      }, 3000);

      return;
    }

    const payload = {
      payment_status: "waiting_verification",
      paid_at: new Date().toISOString(),
    };

    if (payment.payment_method !== "cash") {
      payload.sender_name = paymentForm.sender_name.trim();
      payload.sender_account = paymentForm.sender_account.trim();
    }

    const { error } = await supabase
      .from("payments")
      .update(payload)
      .eq("order_id", order.id);

    if (error) throw error;

    setPayment((prev) => ({
      ...prev,
      ...payload,
    }));

    setPaymentToast({
      show: true,
      type: "success",
      message: "Konfirmasi pembayaran berhasil dikirim.",
    });

    setTimeout(() => {
      navigate(`/order-tracking/${order.id}`);
    }, 1200);
  } catch (err) {
    console.error("Gagal mengirim konfirmasi pembayaran:", err);

    setPaymentToast({
      show: true,
      type: "error",
      message: "Gagal mengirim konfirmasi pembayaran.",
    });

    setTimeout(() => {
      setPaymentToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3000);
  }
};

// =========================
// HANDLE CANCEL ORDER
// =========================
const handleCancelOrder = async () => {
  if (!order) return;

  try {
    setCancelLoading(true);

    const { error } = await supabase.rpc("cancel_unpaid_order", {
      p_order: order.id,
    });

    if (error) throw error;

    setCancelToast({
      show: true,
      type: "success",
      message: "Pesanan berhasil dibatalkan.",
    });

    setTimeout(() => {
      navigate("/menu");
    }, 1500);
  } catch (err) {
    console.error(err);

    setCancelToast({
      show: true,
      type: "error",
      message: "Pesanan tidak dapat dibatalkan.",
    });
  } finally {
    setCancelLoading(false);
    setShowCancelModal(false);
  }
};
  // =========================
  // SCROLL KE PEMBAYARAN
  // =========================
  const scrollToPayment = () => {
    const paymentSection = document.getElementById("payment-section");

    if (paymentSection) {
      paymentSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <MainLayout>
        <section className="min-h-[70vh] flex items-center justify-center px-5">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin" />

            <p className="text-gray-500 mt-5">
              Memuat pesanan...
            </p>
          </div>
        </section>
      </MainLayout>
    );
  }

  // =========================
  // ORDER NOT FOUND
  // =========================
  if (!order) {
    return (
      <MainLayout>
        <section className="min-h-[70vh] flex items-center justify-center px-5">
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-5">
              📦
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Pesanan tidak ditemukan
            </h1>

            <p className="text-gray-500 mt-3">
              Pesanan yang kamu cari tidak tersedia.
            </p>

            <button
              onClick={() => navigate("/menu")}
              className="mt-7 px-7 py-3 rounded-xl bg-amber-700 text-white font-semibold hover:bg-amber-800 transition"
            >
              Kembali ke Menu
            </button>
          </div>
        </section>
      </MainLayout>
    );
  }

  const paymentStatus = payment?.payment_status;

  const canTrack =
    paymentStatus === "waiting_verification" ||
    paymentStatus === "paid";

  const isPending = paymentStatus === "pending";

  return (
    <MainLayout>

  {cancelToast.show && (
  <div className="fixed top-24 right-5 z-[100] w-[calc(100%-40px)] max-w-sm animate-[slideIn_0.4s_ease-out]">
    <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-4">

      <div className="flex items-center gap-3">

        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center ${
            cancelToast.type === "success"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {cancelToast.type === "success" ? "✓" : "✕"}
        </div>

        <div className="flex-1">
          <p className="font-semibold">
            {cancelToast.type === "success"
              ? "Pesanan"
              : "Pembatalan"}
          </p>

          <p className="text-sm text-gray-500">
            {cancelToast.message}
          </p>
        </div>

      </div>

    </div>
  </div>
)}

      {/* =========================
          PAYMENT TOAST
      ========================= */}
      {paymentToast.show && (
        <div className="fixed top-24 right-5 z-[100] w-[calc(100%-40px)] max-w-sm animate-[slideIn_0.4s_ease-out]">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-4">
            <div className="flex items-center gap-3">

              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                  paymentToast.type === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {paymentToast.type === "success" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  {paymentToast.type === "success"
                    ? "Pembayaran"
                    : "Perhatian"}
                </p>

                <p className="text-sm text-gray-500 mt-0.5">
                  {paymentToast.message}
                </p>
              </div>

              <button
                onClick={() =>
                  setPaymentToast((prev) => ({
                    ...prev,
                    show: false,
                  }))
                }
                className="text-gray-400 hover:text-gray-700 text-xl transition shrink-0"
                aria-label="Tutup"
              >
                ×
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =========================
          COPY SUCCESS TOAST
      ========================= */}
      {copySuccess && (
        <div className="fixed top-24 right-5 z-[100] w-[calc(100%-40px)] max-w-sm animate-[slideIn_0.4s_ease-out]">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-4">
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12l4 4L19 7"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  Nomor pesanan disalin
                </p>

                <p className="text-sm text-gray-500 mt-0.5">
                  Nomor pesanan berhasil disalin ke clipboard.
                </p>
              </div>

              <button
                onClick={() => setCopySuccess(false)}
                className="text-gray-400 hover:text-gray-700 text-xl transition shrink-0"
                aria-label="Tutup"
              >
                ×
              </button>

            </div>
          </div>
        </div>
      )}

      <section className="max-w-4xl mx-auto px-5 py-20">

        {/* =========================
            SUCCESS ANIMATION
        ========================= */}
        <div className="text-center mb-10">

          <div className="relative w-28 h-28 mx-auto">

            <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-30" />

            <div className="relative w-28 h-28 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center animate-[scaleIn_0.5s_ease-out]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  className="w-10 h-10 animate-[checkDraw_0.6s_ease-out]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

          </div>

          <div className="mt-8 animate-[fadeUp_0.6s_ease-out]">

            <p className="text-sm font-semibold tracking-[0.25em] uppercase text-green-600">
              Order Confirmed
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Pesanan Berhasil!
            </h1>

            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Terima kasih! Pesanan kamu sudah berhasil
              diterima.
            </p>

          </div>
        </div>

        {/* =========================
            PAYMENT WARNING
        ========================= */}
        {isPending && (
          <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 animate-[fadeUp_0.7s_ease-out]">
            <div className="flex gap-4">

              <div className="w-11 h-11 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0">
                <span className="text-xl">
                  !
                </span>
              </div>

              <div>
                <h3 className="font-bold text-yellow-900">
                  Konfirmasi Pembayaran Diperlukan
                </h3>

                <p className="text-sm text-yellow-800 mt-1">
                  Silakan lakukan pembayaran dan kirim
                  konfirmasi terlebih dahulu sebelum
                  melacak pesanan.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =========================
            ORDER CARD
        ========================= */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden animate-[fadeUp_0.8s_ease-out]">

          {/* Order Header */}
          <div className="p-6 md:p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div>
                <p className="text-sm text-gray-500">
                  Nomor Pesanan
                </p>

                <p className="font-bold text-gray-900 mt-1 break-all">
                  {order.order_number}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(order.created_at).toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Status Pesanan
                </p>

                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  {order.status}
                </span>
              </div>

            </div>
          </div>

          {/* =========================
              CUSTOMER INFO
          ========================= */}
          <div className="p-6 md:p-8 border-b border-gray-200">

            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Informasi Pelanggan
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <p className="text-sm text-gray-500">
                  Nama
                </p>

                <p className="font-medium text-gray-900 mt-1">
                  {order.customer_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  WhatsApp
                </p>

                <p className="font-medium text-gray-900 mt-1">
                  {order.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Alamat
                </p>

                <p className="font-medium text-gray-900 mt-1">
                  {order.address}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Pembayaran
                </p>

                <p className="font-medium text-gray-900 mt-1">
                  {payment?.payment_method?.toUpperCase()}
                </p>
              </div>

            </div>

            {order.note && (
              <div className="mt-5 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">
                  Catatan Pesanan
                </p>

                <p className="font-medium text-gray-900 mt-1">
                  {order.note}
                </p>
              </div>
            )}

          </div>

          {/* =========================
              PAYMENT INFO
          ========================= */}
          <div
            id="payment-section"
            className="p-6 md:p-8 border-b border-gray-200"
          >

            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Informasi Pembayaran
            </h2>

            {/* Status */}
            <div className="mb-5">

              <p className="text-sm text-gray-500">
                Status Pembayaran
              </p>

              <span
                className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  payment?.payment_status === "paid"
                    ? "bg-green-100 text-green-700"
                    : payment?.payment_status === "waiting_verification"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {payment?.payment_status === "pending" &&
                  "Menunggu Pembayaran"}

                {payment?.payment_status === "waiting_verification" &&
                  "Menunggu Verifikasi Admin"}

                {payment?.payment_status === "paid" &&
                  "Pembayaran Berhasil"}
              </span>

            </div>

            {/* =========================
                WAITING VERIFICATION
            ========================= */}
            {payment?.payment_status === "waiting_verification" && (
              <div className="rounded-xl border border-yellow-200 p-5 bg-yellow-50">

                <p className="font-bold text-lg text-yellow-900">
                  Pembayaran sedang diverifikasi
                </p>

                <p className="mt-2 text-yellow-800">
                  Konfirmasi pembayaran kamu sudah diterima.
                  Tim kami sedang memverifikasi pembayaran.
                </p>

              </div>
            )}

            {/* =========================
                PAID
            ========================= */}
            {payment?.payment_status === "paid" && (
              <div className="rounded-xl border border-green-200 p-5 bg-green-50">

                <p className="font-bold text-lg text-green-900">
                  Pembayaran Berhasil
                </p>

                <p className="mt-2 text-green-800">
                  Pembayaran kamu sudah diverifikasi oleh admin.
                </p>

              </div>
            )}

            {/* =========================
                CASH
            ========================= */}
            {payment?.payment_method === "cash" &&
              payment?.payment_status === "pending" && (
                <div className="rounded-xl border p-5 bg-green-50">

                  <p className="font-bold text-lg">
                    💵 Pembayaran Cash
                  </p>

                  <p className="mt-3 text-gray-600">
                    Silakan lakukan pembayaran langsung kepada
                    kasir.
                  </p>

                  <button
                    onClick={handleConfirmPayment}
                    className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                  >
                    Konfirmasi Pembayaran
                  </button>

                </div>
              )}

            {/* =========================
                TRANSFER
            ========================= */}
            {payment?.payment_method === "transfer" &&
              payment?.payment_status === "pending" && (
                <div className="rounded-xl border p-5 bg-blue-50">

                  <p className="font-bold text-lg">
                    🏦 Transfer Bank
                  </p>

                  <div className="mt-4 space-y-1">
                    <p>
                      <b>BCA</b>
                    </p>

                    <p>
                      1234567890
                    </p>

                    <p>
                      a.n Coffee Shop
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">

                    <input
                      type="text"
                      name="sender_name"
                      placeholder="Nama Pengirim"
                      value={paymentForm.sender_name}
                      onChange={handlePaymentInput}
                      className="w-full border rounded-xl p-3"
                    />

                    <input
                      type="text"
                      name="sender_account"
                      placeholder="Nomor Rekening"
                      value={paymentForm.sender_account}
                      onChange={handlePaymentInput}
                      className="w-full border rounded-xl p-3"
                    />

                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                  >
                    Konfirmasi Pembayaran
                  </button>

                </div>
              )}

            {/* =========================
    QRIS
========================= */}

{payment?.payment_method === "qris" &&
  payment?.payment_status === "pending" && (
    <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">

  <h3 className="text-xl font-bold flex items-center gap-2">
    📱 Pembayaran QRIS
  </h3>

  <p className="mt-3 text-center text-gray-600">
    Scan QR Code berikut menggunakan aplikasi
    <span className="font-semibold">
      {" "}DANA, OVO, GoPay, ShopeePay, atau Mobile Banking
    </span>
    untuk melakukan pembayaran.
  </p>

  <div className="flex justify-center mt-6">
    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-200">
      <img
  src={qrcode}
  alt="QRIS"
  onClick={() => setShowQrModal(true)}
  className="w-full max-w-md rounded-xl cursor-pointer hover:scale-105 transition duration-300"
/>

<p className="text-center text-sm text-gray-500 mt-3">
  Klik gambar untuk memperbesar
</p>
    </div>
  </div>

  <div className="mt-8 space-y-3">
    <input
      type="text"
      name="sender_name"
      placeholder="Nama Pengirim"
      value={paymentForm.sender_name}
      onChange={handlePaymentInput}
      className="w-full border rounded-xl p-3"
    />

    <input
      type="text"
      name="sender_account"
      placeholder="Nomor HP / DANA"
      value={paymentForm.sender_account}
      onChange={handlePaymentInput}
      className="w-full border rounded-xl p-3"
    />
  </div>

  <button
    onClick={handleConfirmPayment}
    className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
  >
    Konfirmasi Pembayaran
  </button>

</div>
)}

    </div>
        {/* =========================
    ACTION BUTTONS
========================= */}
<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-[fadeUp_1s_ease-out]">

  {/* WAITING / PAID */}
  {canTrack && (
    <button
      onClick={() => navigate(`/order-tracking/${order.id}`)}
      className="group px-6 py-4 rounded-2xl bg-amber-700 text-white font-semibold shadow-md hover:bg-amber-800 hover:shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-3"
    >
      <span>Lacak Pesanan</span>
      <span className="group-hover:translate-x-1 transition">→</span>
    </button>
  )}

  {/* COPY */}
  <button
    onClick={copyOrderNumber}
    className="px-6 py-4 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition flex items-center justify-center gap-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>

    Salin Nomor Pesanan
  </button>

  {/* CANCEL */}
  {payment?.payment_status === "pending" && (
    <button
      onClick={() => setShowCancelModal(true)}
      disabled={cancelLoading}
      className="px-6 py-4 rounded-2xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-60"
    >
      {cancelLoading ? "Membatalkan..." : "Batalkan Pesanan"}
    </button>
  )}

  {/* BACK */}
  <button
    onClick={() => navigate("/menu")}
    className="px-6 py-4 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition sm:col-span-2"
  >
    Kembali ke Menu
  </button>

</div>
{/* =========================
    INFO
========================= */}
<div className="mt-8 text-center">
  {isPending ? (
    <p className="text-sm text-gray-500">
      Lakukan pembayaran dan konfirmasi terlebih dahulu
      untuk melacak pesanan.
    </p>
  ) : (
    <p className="text-sm text-gray-500">
      Simpan nomor pesanan kamu untuk melihat status
      pesanan kapan saja.
    </p>
  )}
</div>

{/* =========================
    CUSTOM ANIMATION
========================= */}
<style>
  {`
    @keyframes scaleIn {
      0% {
        transform: scale(0);
        opacity: 0;
      }

      70% {
        transform: scale(1.1);
      }

      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes checkDraw {
      0% {
        stroke-dasharray: 50;
        stroke-dashoffset: 50;
      }

      100% {
        stroke-dasharray: 50;
        stroke-dashoffset: 0;
      }
    }

    @keyframes fadeUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }

      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(30px);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `}
</style>

</div>

</section>

{/* =========================
    CANCEL MODAL
========================= */}
{showCancelModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">

      <h2 className="text-xl font-bold">
        Batalkan Pesanan?
      </h2>

      <p className="mt-3 text-gray-600">
        Pesanan yang belum dibayar akan dihapus secara permanen.
        Tindakan ini tidak dapat dibatalkan.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowCancelModal(false)}
          className="px-5 py-2 rounded-xl border"
        >
          Tidak
        </button>

        <button
          disabled={cancelLoading}
          onClick={handleCancelOrder}
          className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
        >
          {cancelLoading
            ? "Membatalkan..."
            : "Ya, Batalkan"}
        </button>
      </div>

    </div>
  </div>
)}

    {showQrModal && (
  <div
    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    onClick={() => setShowQrModal(false)}
  >
    <button
      className="absolute top-5 right-5 text-white text-5xl font-bold"
      onClick={() => setShowQrModal(false)}
    >
      ✕
    </button>

    <img
      src={qrcode}
      alt="QRIS Full"
      className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}

</MainLayout>
);
}