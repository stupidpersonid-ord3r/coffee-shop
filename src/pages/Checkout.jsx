import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "Cash",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT ORDER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    // =========================
    // VALIDATION
    // =========================
    if (!form.customerName.trim()) {
      setErrorMessage("Nama lengkap wajib diisi.");
      return;
    }

    if (!form.phone.trim()) {
      setErrorMessage("Nomor WhatsApp wajib diisi.");
      return;
    }

    if (!form.address.trim()) {
      setErrorMessage("Alamat wajib diisi.");
      return;
    }

    if (cart.length === 0) {
      setErrorMessage("Keranjang masih kosong.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // 1. SIMPAN ORDER
      // =========================
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: form.customerName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          note: form.note.trim() || null,
          payment_method: form.paymentMethod,
          total: totalPrice,
        })
        .select("*")
        .single();

      if (orderError) {
        throw orderError;
      }

      // Pastikan nomor pesanan berhasil dibuat
      if (!order?.order_number) {
        throw new Error(
          "Nomor pesanan gagal dibuat. Silakan coba lagi."
        );
      }

      // =========================
      // 2. SIMPAN ORDER ITEMS
      // =========================
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // =========================
      // 3. KOSONGKAN CART
      // =========================
      clearCart();

      // =========================
      // 4. KE ORDER SUCCESS
      // =========================
      navigate(`/order-success/${order.id}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Error membuat pesanan:", error);

      setErrorMessage(
        error.message ||
          "Terjadi kesalahan saat membuat pesanan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="max-w-7xl mx-auto px-5 py-24">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-10">
          <p className="text-sm font-medium text-amber-700 uppercase tracking-widest mb-2">
            Checkout
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Selesaikan Pesanan
          </h1>

          <p className="text-gray-500 mt-3">
            Lengkapi informasi di bawah untuk melanjutkan
            pesanan.
          </p>
        </div>

        {/* =========================
            EMPTY CART
        ========================= */}
        {cart.length === 0 ? (
          <div className="border border-gray-200 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              🛒
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Keranjang masih kosong
            </h2>

            <p className="text-gray-500 mt-2">
              Silakan tambahkan produk terlebih dahulu.
            </p>

            <button
              onClick={() => navigate("/menu")}
              className="mt-6 px-6 py-3 rounded-xl bg-amber-700 text-white font-semibold hover:bg-amber-800 transition"
            >
              Kembali ke Menu
            </button>

          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* =========================
                  CUSTOMER FORM
              ========================= */}
              <div className="lg:col-span-2">

                <div className="border border-gray-200 rounded-2xl p-6 md:p-8">

                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Informasi Pelanggan
                  </h2>

                  <div className="space-y-5">

                    {/* NAMA */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap
                      </label>

                      <input
                        type="text"
                        name="customerName"
                        value={form.customerName}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        autoComplete="name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
                      />
                    </div>

                    {/* WHATSAPP */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor WhatsApp
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Contoh: 081234567890"
                        autoComplete="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
                      />

                      <p className="text-xs text-gray-500 mt-2">
                        Nomor ini digunakan untuk menemukan kembali pesanan kamu.
                      </p>
                    </div>

                    {/* ALAMAT */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat
                      </label>

                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Masukkan alamat lengkap"
                        autoComplete="street-address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition resize-none"
                      />
                    </div>

                    {/* CATATAN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catatan Pesanan
                      </label>

                      <textarea
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Contoh: Tidak terlalu manis, tanpa es, dll."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition resize-none"
                      />
                    </div>

                    {/* PAYMENT */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Metode Pembayaran
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* CASH */}
                        <label
                          className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                            form.paymentMethod === "Cash"
                              ? "border-amber-600 bg-amber-50"
                              : "border-gray-300 hover:border-amber-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Cash"
                            checked={
                              form.paymentMethod === "Cash"
                            }
                            onChange={handleChange}
                            className="accent-amber-700"
                          />

                          <span className="font-medium">
                            Cash
                          </span>
                        </label>

                        {/* TRANSFER */}
                        <label
                          className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                            form.paymentMethod === "Transfer"
                              ? "border-amber-600 bg-amber-50"
                              : "border-gray-300 hover:border-amber-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Transfer"
                            checked={
                              form.paymentMethod === "Transfer"
                            }
                            onChange={handleChange}
                            className="accent-amber-700"
                          />

                          <span className="font-medium">
                            Transfer
                          </span>
                        </label>

                      </div>
                    </div>

                    {/* ERROR */}
                    {errorMessage && (
                      <div className="flex gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
                        <span>⚠️</span>

                        <p>
                          {errorMessage}
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              </div>

              {/* =========================
                  ORDER SUMMARY
              ========================= */}
              <div>

                <div className="border border-gray-200 rounded-2xl p-6 sticky top-24">

                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Ringkasan Pesanan
                  </h2>

                  <div className="space-y-4">

                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-4"
                      >

                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {item.quantity} × Rp{" "}
                            {Number(item.price).toLocaleString(
                              "id-ID"
                            )}
                          </p>
                        </div>

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

                  <div className="border-t border-gray-200 my-6" />

                  {/* TOTAL */}
                  <div className="flex justify-between items-center">

                    <span className="text-gray-500">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                      Rp{" "}
                      {totalPrice.toLocaleString("id-ID")}
                    </span>

                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 px-6 py-3.5 rounded-xl bg-amber-700 text-white font-semibold hover:bg-amber-800 active:scale-[0.98] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Memproses Pesanan...
                      </span>
                    ) : (
                      "Buat Pesanan"
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-400 mt-4">
                    Setelah pesanan dibuat, kamu akan mendapatkan
                    nomor pesanan untuk melacak statusnya.
                  </p>

                </div>
              </div>

            </div>
          </form>
        )}

      </section>
    </MainLayout>
  );
}