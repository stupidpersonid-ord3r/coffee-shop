import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

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

  useEffect(() => {
    async function fetchOrder() {
      try {
        // =========================
        // AMBIL ORDER
        // =========================
        const { data: orderData, error: orderError } =
          await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (orderError) {
          throw orderError;
        }

        // =========================
        // AMBIL ORDER ITEMS
        // =========================
        const { data: itemData, error: itemError } =
          await supabase
            .from("order_items")
            .select(`
              id,
              quantity,
              price,
              products (
                name,
                image
              )
            `)
            .eq("order_id", orderId);

        if (itemError) {
          throw itemError;
        }

        setOrder(orderData);
        setItems(itemData || []);
      } catch (error) {
        console.error("Error mengambil order:", error);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

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

  return (
    <MainLayout>

      {/* =========================
          COPY SUCCESS TOAST
      ========================= */}
      {copySuccess && (
        <div className="fixed top-24 right-5 z-[100] w-[calc(100%-40px)] max-w-sm animate-[slideIn_0.4s_ease-out]">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-4">

            <div className="flex items-center gap-3">

              {/* ICON */}
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

              {/* TEXT */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  Nomor pesanan disalin
                </p>

                <p className="text-sm text-gray-500 mt-0.5">
                  Nomor pesanan berhasil disalin ke clipboard.
                </p>
              </div>

              {/* CLOSE */}
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

          {/* Outer Circle */}
          <div className="relative w-28 h-28 mx-auto">

            {/* Pulse */}
            <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-30" />

            {/* Main Circle */}
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

          {/* Heading */}
          <div className="mt-8 animate-[fadeUp_0.6s_ease-out]">
            <p className="text-sm font-semibold tracking-[0.25em] uppercase text-green-600">
              Order Confirmed
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Pesanan Berhasil! 🎉
            </h1>

            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Terima kasih! Pesanan kamu sudah berhasil
              diterima dan sedang menunggu untuk diproses.
            </p>
          </div>
        </div>

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

              {/* Status */}
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
                  {order.payment_method}
                </p>
              </div>

            </div>

            {/* Note */}
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
              ORDER ITEMS
          ========================= */}
          <div className="p-6 md:p-8">

            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Detail Pesanan
            </h2>

            <div className="space-y-4">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-gray-50 transition"
                >

                  {/* Product */}
                  <div className="flex items-center gap-4">

                    {item.products?.image && (
                      <img
                        src={item.products.image}
                        alt={item.products.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    )}

                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.products?.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.quantity} × Rp{" "}
                        {Number(item.price).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>

                  </div>

                  {/* Subtotal */}
                  <p className="font-semibold text-gray-900 whitespace-nowrap">
                    Rp{" "}
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toLocaleString("id-ID")}
                  </p>

                </div>
              ))}

            </div>

            {/* Total */}
            <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-center">

              <span className="text-gray-500">
                Total Pesanan
              </span>

              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                Rp{" "}
                {Number(order.total).toLocaleString(
                  "id-ID"
                )}
              </span>

            </div>
          </div>

        </div>

        {/* =========================
            ACTION BUTTONS
        ========================= */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-[fadeUp_1s_ease-out]">

          {/* TRACK ORDER */}
          <button
            onClick={() =>
              navigate(`/order-tracking/${order.id}`)
            }
            className="group px-6 py-4 rounded-2xl bg-amber-700 text-white font-semibold shadow-md hover:bg-amber-800 hover:shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-3"
          >
            <span>
              Lacak Pesanan
            </span>

            <span className="group-hover:translate-x-1 transition">
              →
            </span>
          </button>

          {/* COPY ORDER NUMBER */}
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
              <rect
                x="9"
                y="9"
                width="11"
                height="11"
                rx="2"
              />

              <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              />
            </svg>

            Salin Nomor Pesanan
          </button>

          {/* BACK TO MENU */}
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
          <p className="text-sm text-gray-500">
            Simpan nomor pesanan kamu untuk melihat
            status pesanan kapan saja.
          </p>
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

      </section>
    </MainLayout>
  );
}