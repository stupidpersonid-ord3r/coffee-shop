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

  // =========================
  // NORMALIZE ORDER NUMBER
  // =========================
  const normalizeOrderNumber = (value) => {
    return value
      .trim()
      .replace(/^#/, "")
      .replace(/\s+/g, "")
      .toUpperCase();
  };

  // =========================
  // NORMALIZE PHONE
  // =========================
  const normalizePhone = (value) => {
    let cleaned = value
      .trim()
      .replace(/\s+/g, "")
      .replace(/-/g, "");

    // +62xxxxxxxx
    if (cleaned.startsWith("+62")) {
      cleaned = "0" + cleaned.slice(3);
    }

    // 62xxxxxxxx
    if (cleaned.startsWith("62")) {
      cleaned = "0" + cleaned.slice(2);
    }

    return cleaned;
  };

  // =========================
  // HANDLE SEARCH
  // =========================
  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");

    const normalizedOrderNumber =
      normalizeOrderNumber(orderNumber);

    const normalizedPhone = normalizePhone(phone);

    // =========================
    // VALIDATION
    // =========================
    if (!normalizedOrderNumber) {
      setError("Nomor pesanan wajib diisi.");
      return;
    }

    if (!normalizedPhone) {
      setError("Nomor WhatsApp wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // CARI PESANAN
      // =========================
      const { data, error: searchError } = await supabase
        .from("orders")
        .select("id, order_number, phone")
        .eq("order_number", normalizedOrderNumber)
        .eq("phone", normalizedPhone)
        .maybeSingle();

      // =========================
      // ERROR SUPABASE
      // =========================
      if (searchError) {
        console.error(
          "Find order Supabase error:",
          searchError
        );

        setError(
          "Terjadi kesalahan saat mencari pesanan. Silakan coba lagi."
        );

        return;
      }

      // =========================
      // PESANAN TIDAK DITEMUKAN
      // =========================
      if (!data) {
        setError(
          "Pesanan tidak ditemukan. Pastikan nomor pesanan dan nomor WhatsApp sudah benar."
        );

        return;
      }

      // =========================
      // PESANAN DITEMUKAN
      // =========================
      navigate(`/order-tracking/${data.id}`);
    } catch (err) {
      console.error("Search order error:", err);

      setError(
        "Terjadi kesalahan saat mencari pesanan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-5 py-20">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-gray-200 p-8">

          {/* =========================
              HEADER
          ========================= */}
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

          {/* =========================
              FORM
          ========================= */}
          <form
            onSubmit={handleSearch}
            className="space-y-5"
          >

            {/* =========================
                ORDER NUMBER
            ========================= */}
            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Nomor Pesanan
              </label>

              <input
                type="text"
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  setError("");
                }}
                placeholder="ORD-20260814-0001"
                autoComplete="off"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:ring-2
                  focus:ring-amber-600
                  focus:border-transparent
                "
              />

              <p className="text-xs text-gray-400 mt-2">
                Contoh: ORD-20260814-0001
              </p>

            </div>

            {/* =========================
                PHONE
            ========================= */}
            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Nomor WhatsApp
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                placeholder="08123456789"
                autoComplete="tel"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:ring-2
                  focus:ring-amber-600
                  focus:border-transparent
                "
              />

              <p className="text-xs text-gray-400 mt-2">
                Bisa menggunakan 08..., 62..., atau +62...
              </p>

            </div>

            {/* =========================
                ERROR
            ========================= */}
            {error && (
              <div className="
                flex
                items-start
                gap-3
                rounded-xl
                bg-red-50
                border
                border-red-200
                text-red-600
                p-4
                text-sm
              ">
                <span className="text-base">
                  ⚠️
                </span>

                <p>
                  {error}
                </p>
              </div>
            )}

            {/* =========================
                BUTTON
            ========================= */}
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
                  <span className="
                    text-xl
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  ">
                    🔍
                  </span>

                  <span>
                    Lacak Pesanan
                  </span>

                  <span className="
                    text-lg
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  ">
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