import { Link } from "react-router-dom";
import {
  FaCoffee,
  FaLeaf,
  FaUsers,
  FaAward,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

export default function About() {
  return (
    <MainLayout>

      {/* ================= HERO ================= */}
      <section
        className="relative h-[70vh] flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative max-w-4xl px-6 text-white">
          <p className="uppercase tracking-[0.3em] text-amber-300 font-semibold">
            About Us
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mt-5 leading-tight">
            Lebih dari Sekadar
            <br />
            Secangkir Kopi
          </h1>

          <p className="mt-6 text-lg text-gray-200 leading-8">
            Kami percaya setiap cangkir kopi memiliki cerita.
            Dibuat dari biji kopi pilihan Indonesia dan disajikan
            dengan sepenuh hati untuk menemani setiap momenmu.
          </p>

          <Link
            to="/menu"
            className="inline-block mt-8 bg-amber-700 hover:bg-amber-800 transition px-8 py-4 rounded-xl font-semibold"
          >
            Lihat Menu
          </Link>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200"
            alt="Coffee Shop"
            className="rounded-3xl shadow-2xl h-[520px] object-cover w-full"
          />

          <div>

            <p className="uppercase text-amber-700 tracking-[0.2em] font-semibold">
              Our Story
            </p>

            <h2 className="text-4xl font-bold mt-3">
              Kopi Berkualitas,
              <br />
              Pengalaman Berkualitas
            </h2>

            <p className="mt-6 text-gray-600 leading-8">
              Coffee Shop berdiri dengan tujuan menghadirkan kopi
              berkualitas yang dapat dinikmati semua orang.
              Kami bekerja sama dengan petani kopi lokal untuk
              mendapatkan biji kopi terbaik dari berbagai daerah
              di Indonesia.
            </p>

            <p className="mt-5 text-gray-600 leading-8">
              Tidak hanya menyajikan minuman, kami ingin
              menciptakan tempat yang nyaman untuk bekerja,
              belajar, berdiskusi, maupun menikmati waktu
              bersama keluarga dan teman.
            </p>

          </div>

        </div>

      </section>

      {/* ================= WHY US ================= */}
      <section className="bg-stone-100 py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">

            <p className="uppercase tracking-widest text-amber-700 font-semibold">
              Why Choose Us
            </p>

            <h2 className="text-4xl font-bold mt-3">
              Mengapa Memilih Kami?
            </h2>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">
              <FaCoffee className="text-5xl text-amber-700 mx-auto mb-5" />
              <h3 className="font-bold text-xl">
                Premium Coffee
              </h3>
              <p className="mt-3 text-gray-500">
                Menggunakan biji kopi pilihan terbaik.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">
              <FaLeaf className="text-5xl text-green-600 mx-auto mb-5" />
              <h3 className="font-bold text-xl">
                Fresh Ingredients
              </h3>
              <p className="mt-3 text-gray-500">
                Selalu menggunakan bahan segar setiap hari.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">
              <FaUsers className="text-5xl text-blue-600 mx-auto mb-5" />
              <h3 className="font-bold text-xl">
                Friendly Service
              </h3>
              <p className="mt-3 text-gray-500">
                Pelayanan cepat dan ramah untuk semua pelanggan.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">
              <FaAward className="text-5xl text-red-500 mx-auto mb-5" />
              <h3 className="font-bold text-xl">
                Best Quality
              </h3>
              <p className="mt-3 text-gray-500">
                Menjaga kualitas rasa di setiap sajian.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}
      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              ["10K+", "Happy Customers"],
              ["25+", "Coffee Menu"],
              ["8", "Professional Barista"],
              ["4.9★", "Customer Rating"],
            ].map(([number, text]) => (
              <div
                key={text}
                className="bg-white rounded-3xl shadow-md p-10 text-center hover:-translate-y-2 transition"
              >
                <h3 className="text-5xl font-bold text-amber-700">
                  {number}
                </h3>

                <p className="mt-4 text-gray-500">
                  {text}
                </p>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* ================= GALLERY ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="text-center mb-14">

          <p className="uppercase tracking-widest text-amber-700 font-semibold">
            Gallery
          </p>

          <h2 className="text-4xl font-bold mt-3">
            Suasana Coffee Shop
          </h2>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {[
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600",
            "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
          ].map((img) => (
            <img
              key={img}
              src={img}
              alt="Gallery"
              className="rounded-3xl h-72 w-full object-cover hover:scale-105 transition duration-300"
            />
          ))}

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="bg-amber-700 text-white py-20">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold">
            Siap Menikmati Kopi Terbaik?
          </h2>

          <p className="mt-5 text-amber-100 text-lg">
            Temukan menu favoritmu dan pesan langsung sekarang.
          </p>

          <Link
            to="/menu"
            className="inline-block mt-8 bg-white text-amber-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition"
          >
            Jelajahi Menu
          </Link>

        </div>

      </section>

    </MainLayout>
  );
}