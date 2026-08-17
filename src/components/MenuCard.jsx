import { FaShoppingCart, FaStar } from "react-icons/fa";
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

        {/* Best Seller */}
        {item.totalSold && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              🔥 Best Seller
            </span>
          </div>
        )}

        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-amber-700">
            {item.category}
          </span>
        </div>

      </div>

      {/* Content */}
      <div className="p-6">

        <div className="flex justify-between items-start">

          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {item.name}
            </h3>

            <div className="flex items-center gap-1 mt-2">

              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />

              <span className="text-sm text-gray-500 ml-2">
                5.0
              </span>

            </div>
          </div>

          {item.totalSold && (
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Terjual
              </p>

              <p className="font-bold text-green-600">
                {item.totalSold}
              </p>
            </div>
          )}

        </div>

        {/* Price */}
        <div className="mt-6 flex justify-between items-center">

          <div>

            <p className="text-sm text-gray-400">
              Mulai dari
            </p>

            <h4 className="text-2xl font-bold text-amber-700">
              Rp {Number(item.price).toLocaleString("id-ID")}
            </h4>

          </div>

          <button
            onClick={() => addToCart(item)}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 rounded-xl transition shadow-md hover:shadow-xl active:scale-95"
          >
            <FaShoppingCart />
            <span>Tambah</span>
          </button>

        </div>

      </div>
    </div>
  );
}