import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaStar,
  FaBoxOpen,
} from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50 to-white pt-20">

      {/* Background Blur */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />

      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* ================= LEFT ================= */}
        <div>

          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">
            <FaStar />
            Premium Coffee Since 2025
          </span>

          {/* Heading */}
          <h1 className="mt-7 text-5xl lg:text-7xl font-extrabold leading-tight text-stone-900">
            Every Cup
            <br />
            Tells a Story
          </h1>

          {/* Description */}
          <p className="mt-7 text-lg leading-8 text-stone-600 max-w-xl">
            Nikmati pengalaman menikmati kopi premium dari biji kopi
            pilihan Indonesia yang diseduh langsung oleh barista
            profesional untuk menghadirkan cita rasa terbaik di setiap
            cangkir.
          </p>

          {/* ================= MAIN CTA ================= */}
          <div className="mt-10 flex flex-wrap items-center gap-7">

            {/* Lihat Menu */}
            <Link
              to="/menu"
              className="group bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 shadow-lg shadow-amber-200/50 transition-all duration-300 hover:-translate-y-1"
            >
              Lihat Menu

              <FaArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Learn More */}
            <Link
              to="/about"
              className="group relative flex items-center gap-3 text-stone-700 font-semibold transition-all duration-300 hover:text-amber-700"
            >
              <span>
                Learn More
              </span>

              <span className="flex items-center justify-center w-8 h-8 rounded-full border border-stone-300 group-hover:border-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                <FaArrowRight
                  className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>

          </div>

          {/* ================= TRACK ORDER ================= */}
          <div className="mt-7">

            <Link
              to="/find-order"
              className="group inline-flex items-center gap-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl px-5 py-4 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-amber-700 transition-all duration-300">
                <FaBoxOpen className="text-lg" />
              </div>

              {/* Text */}
              <div className="text-left">

                <p className="text-xs text-stone-400 mb-1">
                  Sudah melakukan pemesanan?
                </p>

                <p className="font-semibold text-base">
                  Lacak Pesanan
                </p>

              </div>

              {/* Arrow */}
              <div className="ml-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-700 transition-all duration-300">
                <FaArrowRight
                  className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>

            </Link>

          </div>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-2 gap-8 mt-16">

            {/* Orders */}
            <div>
              <h2 className="text-4xl font-bold text-amber-700">
                1000+
              </h2>

              <p className="text-stone-500 mt-2">
                Pesanan
              </p>
            </div>

            {/* Rating */}
            <div>
              <h2 className="text-4xl font-bold text-amber-700">
                4.9★
              </h2>

              <p className="text-stone-500 mt-2">
                Rating
              </p>
            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="relative flex justify-center">

          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop"
            alt="Coffee"
            className="rounded-[40px] shadow-2xl object-cover h-[650px] w-full max-w-lg"
          />

          {/* Floating Card */}
          <div className="absolute bottom-8 left-4 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">

            <p className="text-sm text-gray-500">
              Best Seller
            </p>

            <h3 className="font-bold text-lg mt-1">
              Caramel Latte
            </h3>

            <p className="text-amber-700 font-bold mt-2">
              Mulai Rp 38.000
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}