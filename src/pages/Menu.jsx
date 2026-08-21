import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import CategoryFilter from "../components/CategoryFilter";
import MenuCard from "../components/MenuCard";
import { supabase } from "../lib/supabase";
import { getBestSellers } from "../services/getBestSellers";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [loadingBestSeller, setLoadingBestSeller] = useState(true);

  // =========================
  // AMBIL PRODUCTS
  // =========================
  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      console.log("PRODUCTS DATA:", data);
      console.log("PRODUCTS ERROR:", error);

      if (error) {
        console.error("Error mengambil produk:", error);
        setLoading(false);
        return;
      }

      setMenu(data || []);
      setLoading(false);
    }

    fetchMenu();
  }, []);

  // =========================
  // AMBIL BEST SELLERS
  // =========================
  useEffect(() => {
    async function fetchBestSellers() {
      setLoadingBestSeller(true);

      const data = await getBestSellers();

      console.log("BEST SELLERS:", data);

      setBestSellers(data || []);
      setLoadingBestSeller(false);
    }

    fetchBestSellers();
  }, []);

  // =========================
  // FILTER MENU
  // =========================
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      return category === "All" || item.category === category;
    });
  }, [menu, category]);

  // =========================
  // FILTER BEST SELLER
  // =========================
  const filteredBestSellers = useMemo(() => {
    return bestSellers.filter((item) => {
      return category === "All" || item.category === category;
    });
  }, [bestSellers, category]);

  return (
    <MainLayout>
      <section className="max-w-7xl mx-auto px-5 py-24">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-10">
          <p className="text-sm font-medium text-amber-700 uppercase tracking-widest mb-2">
            Our Menu
          </p>

          <h1 className="text-5xl font-bold text-gray-900">
            Explore Our Menu
          </h1>

          <p className="text-gray-500 mt-3">
            Pilih minuman dan makanan favorit kamu.
          </p>
        </div>

        {/* =========================
            CATEGORY FILTER
        ========================= */}
        <div className="mb-12">
          <CategoryFilter
            active={category}
            onSelect={setCategory}
          />
        </div>

        {/* =========================
            BEST SELLER
        ========================= */}
        {!loadingBestSeller &&
          filteredBestSellers.length > 0 && (
            <div className="mb-16">

              <div className="mb-6">
                <p className="text-sm font-medium text-amber-700 uppercase tracking-widest">
                  Customer Favorites
                </p>

                <p className="text-gray-500 mt-2">
                  Menu yang paling banyak dipesan customer.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBestSellers.map((item) => (
                  <MenuCard
                    key={`best-${item.id}`}
                    item={{
                      ...item,
                      bestseller: true,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

        {/* =========================
            ALL MENU
        ========================= */}
        <div>

          <div className="mb-6">
            <p className="text-sm font-medium text-amber-700 uppercase tracking-widest">
              Menu
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              Semua Menu
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-stone-500 mt-10">
              Memuat menu...
            </p>
          ) : (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMenu.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>

              {filteredMenu.length === 0 && (
                <p className="text-center text-stone-500 mt-10">
                  Menu tidak ditemukan.
                </p>
              )}
            </>
          )}
        </div>

      </section>
    </MainLayout>
  );
}