import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuCard from "./MenuCard";
import SectionTitle from "./SectionTitle";
import { getBestSellers } from "../services/getBestSellers";

export default function MenuSection() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      setLoading(true);

      try {
        const data = await getBestSellers();
        setMenu(data || []);
      } catch (error) {
        console.error("Error mengambil best seller:", error);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBestSellers();
  }, []);

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-5">

        <SectionTitle
          subtitle="🔥 Best Seller"
          title="Menu Terlaris Kami"
          description="Produk yang paling banyak dipesan oleh pelanggan berdasarkan transaksi yang telah selesai."
        />

        {/* Loading */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-[360px] rounded-3xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : menu.length === 0 ? (

          /* Empty State */
          <div className="text-center mt-12">
            <div className="text-6xl mb-4">
              ☕
            </div>

            <h3 className="text-2xl font-bold text-stone-800">
              Belum Ada Best Seller
            </h3>

            <p className="text-stone-500 mt-3">
              Produk akan muncul di sini setelah ada pesanan yang selesai.
            </p>
          </div>

        ) : (

          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">

              {menu.map((item) => (

                <div
                  key={item.id}
                  className="relative"
                >
                  {/* Badge */}
                  <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    🔥 Best Seller
                  </span>

                  <MenuCard item={item} />
                </div>

              ))}

            </div>

            {/* Button */}
            <div className="text-center mt-14">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                Lihat Semua Menu
                <span>→</span>
              </Link>
            </div>
          </>

        )}

      </div>
    </section>
  );
}