import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";

export default function MyOrders() {
  const navigate = useNavigate();

  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    const cleanOrderNumber = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.trim();

    if (!cleanOrderNumber) {
      setErrorMessage("Nomor pesanan wajib diisi.");
      return;
    }

    if (!cleanPhone) {
      setErrorMessage("Nomor WhatsApp wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // CARI ORDER DI SUPABASE
      // =========================
      const { data: order, error } = await supabase
        .from("orders")
        .select("id, order_number, phone")
        .eq("order_number", cleanOrderNumber)
        .eq("phone", cleanPhone)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // =========================
      // ORDER TIDAK DITEMUKAN
      // =========================
      if (!order) {
        setErrorMessage(
          "Pesanan tidak ditemukan. Pastikan nomor pesanan dan nomor WhatsApp sudah benar."
        );

        return;
      }

      // =========================
      // ORDER DITEMUKAN
      // =========================
      navigate(`/order-tracking/${order.id}`);

    } catch (error) {
      console.error("Error mencari pesanan:", error);

      setErrorMessage(
        "Terjadi kesalahan saat mencari pesanan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-[75vh] flex items-center justify-center px-5 py-20">

        <div className="max-w-xl w-full">

          {/* =========================
              HEADER
          ========================= */}
          <div className="text-center mb-10">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-sm">
              📦
            </div>

            <p className="text-sm font-semibold text-amber-700 uppercase tracking-[0.25em] mt-7">
              My Orders
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Cari Pesanan Kamu
            </h1>

            <p className="text-gray-500 mt-4 leading-7">
              Masukkan nomor pesanan dan nomor WhatsApp
              yang digunakan saat checkout untuk melihat
              status pesanan kamu.
            </p>

          </div>

          {/* =========================
              FORM CARD
          ========================= */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-8">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ORDER NUMBER */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Pesanan
                </label>

                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) =>
                    setOrderNumber(e.target.value)
                  }
                  placeholder="Contoh: ORD-20260814-0001"
                  autoComplete="off"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition uppercase"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Masukkan nomor pesanan yang diberikan
                  setelah checkout.
                </p>

              </div>

              {/* PHONE */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor WhatsApp
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Contoh: 081234567890"
                  autoComplete="tel"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Gunakan nomor WhatsApp yang sama saat
                  checkout.
                </p>

              </div>

              {/* ERROR */}
              {errorMessage && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">

                  <span className="text-lg">
                    ⚠️
                  </span>

                  <p className="text-sm leading-6">
                    {errorMessage}
                  </p>

                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-amber-700 text-white font-semibold hover:bg-amber-800 active:scale-[0.98] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">

                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                    Mencari Pesanan...

                  </span>
                ) : (
                  "Cari Pesanan"
                )}
              </button>

            </form>

          </div>

          {/* =========================
              INFO
          ========================= */}
          <div className="text-center mt-6">

            <p className="text-sm text-gray-400">
              Nomor pesanan dapat ditemukan pada halaman
              konfirmasi setelah checkout.
            </p>

          </div>

        </div>

      </section>
    </MainLayout>
  );
}