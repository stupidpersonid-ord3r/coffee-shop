import { useState } from "react";
import { FaShoppingCart, FaCheck, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function MenuCard({ item }) {
  const { addToCart } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Buka modal
  const handleOpenModal = () => {
    setQuantity(1);
    setShowModal(true);
  };

  // Tutup modal
  const handleCloseModal = () => {
    setShowModal(false);
    setQuantity(1);
  };

  // Tambahkan sesuai quantity
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
      setShowModal(false);
      setQuantity(1);
    }, 1000);
  };

  const totalPrice = Number(item.price) * quantity;

  return (
    <>
      {/* =========================
          MENU CARD
      ========================= */}
      <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900">
            {item.name}
          </h3>

          {item.description && (
            <p className="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between">
            <h4 className="text-2xl font-bold text-amber-700">
              Rp {Number(item.price).toLocaleString("id-ID")}
            </h4>

            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white transition-all duration-300 shadow-md hover:shadow-xl active:scale-95"
            >
              <FaShoppingCart />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          PRODUCT MODAL
      ========================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg hover:bg-white hover:scale-105 transition"
            >
              <FaTimes />
            </button>

            {/* Large Image */}
            <div className="relative w-full h-80 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-6">

              <h2 className="text-2xl font-bold text-gray-900">
                {item.name}
              </h2>

              {item.description && (
                <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Price */}
              <div className="mt-4">
                <span className="text-2xl font-bold text-amber-700">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </span>
              </div>

              {/* Quantity */}
              <div className="mt-6 flex items-center justify-between">

                <span className="font-semibold text-gray-800">
                  Jumlah
                </span>

                <div className="flex items-center gap-4">

                  {/* Minus */}
                  <button
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition active:scale-90"
                  >
                    <FaMinus />
                  </button>

                  {/* Quantity */}
                  <span className="w-8 text-center text-xl font-bold">
                    {quantity}
                  </span>

                  {/* Plus */}
                  <button
                    onClick={() =>
                      setQuantity((prev) => prev + 1)
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-700 text-white hover:bg-amber-800 transition active:scale-90"
                  >
                    <FaPlus />
                  </button>

                </div>
              </div>

              {/* Total */}
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-amber-50 px-5 py-4">
                <span className="font-semibold text-gray-700">
                  Total
                </span>

                <span className="text-xl font-bold text-amber-700">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Add To Cart */}
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`mt-5 flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white shadow-lg transition-all active:scale-95 ${
                  added
                    ? "bg-green-600"
                    : "bg-amber-700 hover:bg-amber-800 hover:shadow-xl"
                }`}
              >
                {added ? (
                  <>
                    <FaCheck />
                    <span>Ditambahkan</span>
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    <span>Tambah ke Keranjang</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}