import MainLayout from "../layouts/MainLayout";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <MainLayout>
      <section className="max-w-7xl mx-auto px-5 py-24">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-amber-700 uppercase tracking-widest mb-2">
            Your Order
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Keranjang Belanja
          </h1>

          <p className="text-gray-500 mt-3">
            Periksa pesanan kamu sebelum melanjutkan ke checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="border border-gray-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">🛒</div>

            <h2 className="text-xl font-semibold text-gray-900">
              Keranjang masih kosong
            </h2>

            <p className="text-gray-500 mt-2">
              Yuk pilih menu favorit kamu terlebih dahulu.
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    {/* Product Info */}
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Rp {item.price.toLocaleString("id-ID")} / item
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition"
                        >
                          −
                        </button>

                        <span className="w-8 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 active:scale-95 transition"
                        >
                          +
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-500 mb-1">
                        Subtotal
                      </p>

                      <p className="text-xl font-bold text-gray-900">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Clear Cart */}
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-fit px-4 py-2.5 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50 hover:border-red-300 transition"
                >
                  Kosongkan Keranjang
                </button>

                {/* Total */}
                <div className="md:text-right">
                  <p className="text-sm text-gray-500">
                    Total Pesanan
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-1">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </h2>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-amber-700 text-white font-semibold shadow-sm hover:bg-amber-800 hover:shadow-md active:scale-[0.98] transition"
                >
                  Lanjut ke Checkout →
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </MainLayout>
  );
}