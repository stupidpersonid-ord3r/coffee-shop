import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";

export default function FindOrder() {
  const navigate = useNavigate();

  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");

    if (!orderNumber.trim()) {
      setError("Nomor pesanan wajib diisi.");
      return;
    }

    if (!phone.trim()) {
      setError("Nomor WhatsApp wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number")
        .eq(
          "order_number",
          orderNumber.trim().toUpperCase()
        )
        .eq(
          "phone",
          phone.trim()
        )
        .single();

      if (error || !data) {
        console.error("Find order error:", error);
        setError("Pesanan tidak ditemukan.");
        return;
      }

      // =========================
      // ORDER DITEMUKAN
      // =========================
      navigate(`/order-tracking/${data.id}`);

    } catch (err) {
      console.error("Search order error:", err);
      setError("Terjadi kesalahan saat mencari pesanan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-5 py-20">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-gray-200 p-8">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">
              🔍
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Cari Pesanan
            </h1>

            <p className="text-gray-500 mt-3">
              Masukkan nomor pesanan dan nomor WhatsApp
              untuk melihat status pesanan.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSearch}
            className="space-y-5"
          >

            {/* ORDER NUMBER */}
            <div>
              <label className="block mb-2 font-medium">
                Nomor Pesanan
              </label>

              <input
                type="text"
                value={orderNumber}
                onChange={(e) =>
                  setOrderNumber(e.target.value)
                }
                placeholder="ORD-20260814-0001"
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-600 outline-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block mb-2 font-medium">
                Nomor WhatsApp
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="08123456789"
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-600 outline-none"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 p-3">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
  type="submit"
  disabled={loading}
  className="
    group
    w-full
    flex
    items-center
    justify-center
    gap-3
    bg-gray-900
    hover:bg-amber-700
    text-white
    py-4
    px-6
    rounded-2xl
    font-semibold
    shadow-lg
    hover:shadow-xl
    transition-all
    duration-300
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
>
  {loading ? (
    <>
      <span
        className="
          w-5
          h-5
          border-2
          border-white/30
          border-t-white
          rounded-full
          animate-spin
        "
      />

      <span>
        Mencari Pesanan...
      </span>
    </>
  ) : (
    <>
      <span className="text-xl transition-transform duration-300 group-hover:scale-110">
        🔍
      </span>

      <span>
        Lacak Pesanan
      </span>

      <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </>
  )}
</button>

          </form>
        </div>
      </section>
    </MainLayout>
  );
}