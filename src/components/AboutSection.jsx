import { Link } from "react-router-dom";

export default function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <span className="text-amber-700 font-semibold uppercase tracking-widest">
              About Us
            </span>

            <h2 className="text-4xl font-bold mt-3 text-stone-900 leading-tight">
              Kopi Berkualitas,
              <br />
              Momen Berkualitas
            </h2>

            <p className="mt-6 text-stone-600 leading-8">
              Kami percaya secangkir kopi bukan hanya minuman,
              tetapi sebuah pengalaman. Setiap biji kopi dipilih
              langsung dari petani lokal Indonesia dan diproses
              dengan standar kualitas terbaik untuk menghasilkan
              cita rasa yang konsisten.
            </p>

            <p className="mt-5 text-stone-600 leading-8">
              Coffee Shop hadir sebagai tempat yang nyaman untuk
              bekerja, belajar, maupun menikmati waktu bersama
              keluarga dan teman sambil menikmati sajian kopi
              premium dan makanan berkualitas.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center bg-amber-700 hover:bg-amber-800 transition text-white px-6 py-3 rounded-xl font-semibold"
              >
                Learn More
              </Link>

              <Link
                to="/menu"
                className="inline-flex items-center border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
              >
                Lihat Menu
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=1200&auto=format&fit=crop"
              alt="Coffee Shop"
              className="w-full h-[500px] object-cover rounded-3xl shadow-xl"
            />

            {/* Floating Card */}
            <div className="absolute -bottom-6 left-6 bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
              <h3 className="text-2xl font-bold text-amber-700">
                1000+
              </h3>
              <p className="text-stone-500">
                Pelanggan Puas
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}