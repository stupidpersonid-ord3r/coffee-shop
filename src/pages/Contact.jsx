import MainLayout from "../layouts/MainLayout";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

export default function Contact() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-amber-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Contact Us
          </h1>

          <p className="text-amber-100 max-w-2xl mx-auto">
            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami
            apabila memiliki pertanyaan, reservasi, atau ingin bekerja sama.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12">

        {/* Informasi */}
        <div>
          <h2 className="text-3xl font-bold mb-8">
            Hubungi Kami
          </h2>

          <div className="space-y-6">

            <div className="flex gap-5 bg-white p-6 rounded-2xl shadow">
              <FaMapMarkerAlt className="text-3xl text-amber-700 mt-1" />

              <div>
                <h3 className="font-bold text-lg">Alamat</h3>

                <p className="text-stone-600">
                  Jl. Sudirman No.123
                </p>

                <p className="text-stone-600">
                  Jakarta Pusat, Indonesia
                </p>
              </div>
            </div>

            <div className="flex gap-5 bg-white p-6 rounded-2xl shadow">
              <FaPhoneAlt className="text-3xl text-amber-700 mt-1" />

              <div>
                <h3 className="font-bold text-lg">
                  Telepon
                </h3>

                <p className="text-stone-600">
                  +62 812 3456 7890
                </p>
              </div>
            </div>

            <div className="flex gap-5 bg-white p-6 rounded-2xl shadow">
              <FaEnvelope className="text-3xl text-amber-700 mt-1" />

              <div>
                <h3 className="font-bold text-lg">
                  Email
                </h3>

                <p className="text-stone-600">
                  hello@coffeeshop.com
                </p>
              </div>
            </div>

            <div className="flex gap-5 bg-white p-6 rounded-2xl shadow">
              <FaClock className="text-3xl text-amber-700 mt-1" />

              <div>
                <h3 className="font-bold text-lg">
                  Jam Operasional
                </h3>

                <p className="text-stone-600">
                  Senin - Jumat : 08.00 - 22.00
                </p>

                <p className="text-stone-600">
                  Sabtu - Minggu : 09.00 - 23.00
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            Kirim Pesan
          </h2>

          <form className="space-y-5">

            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />

            <input
              type="email"
              placeholder="Alamat Email"
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />

            <input
              type="text"
              placeholder="Subjek"
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />

            <textarea
              rows="6"
              placeholder="Tulis pesan Anda..."
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-700"
            ></textarea>

            <button
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-4 rounded-xl font-semibold transition"
            >
              Kirim Pesan
            </button>

          </form>
        </div>

      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl overflow-hidden shadow-xl">

          <iframe
            title="Coffee Shop Location"
            src="https://maps.google.com/maps?q=Monas%20Jakarta&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[450px]"
            loading="lazy"
          ></iframe>

        </div>
      </section>
    </MainLayout>
  );
}