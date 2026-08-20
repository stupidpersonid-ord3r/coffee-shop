import { useState } from "react";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function MenuCard({ item }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(item);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
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
            onClick={handleAddToCart}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 shadow-md active:scale-95 ${
              added
                ? "bg-green-600 text-white"
                : "bg-amber-700 hover:bg-amber-800 text-white hover:shadow-xl"
            }`}
          >
            {added ? <FaCheck /> : <FaShoppingCart />}
            <span>{added ? "Ditambahkan" : "Tambah"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}