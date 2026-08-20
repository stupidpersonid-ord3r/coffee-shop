import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function MenuCard({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
        />

        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-amber-700 shadow">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Nama */}
        <h3 className="text-xl font-bold text-gray-900">
          {item.name}
        </h3>

        {/* Deskripsi */}
        {item.description && (
          <p className="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Harga + Tombol */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-bold text-amber-700">
              Rp {Number(item.price).toLocaleString("id-ID")}
            </h4>
          </div>

          <button
            onClick={() => addToCart(item)}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl active:scale-95"
          >
            <FaShoppingCart />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </div>
  );
}