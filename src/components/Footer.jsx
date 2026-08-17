import { FaCoffee, FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <FaCoffee className="text-amber-500 text-3xl" />
            <h2 className="text-2xl font-bold">Coffee Shop</h2>
          </div>

          <p className="text-stone-300">
            Tempat terbaik untuk menikmati kopi berkualitas dengan suasana
            nyaman dan modern.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Jam Operasional</h3>

          <p>Senin - Jumat : 08.00 - 22.00</p>
          <p>Sabtu - Minggu : 09.00 - 23.00</p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Ikuti Kami</h3>

          <div className="flex gap-5 text-2xl">
            <FaInstagram className="hover:text-pink-500 cursor-pointer transition" />
            <FaFacebook className="hover:text-blue-500 cursor-pointer transition" />
            <FaWhatsapp className="hover:text-green-500 cursor-pointer transition" />
          </div>
        </div>

      </div>

      <div className="border-t border-stone-700 py-5 text-center text-stone-400">
        © 2026 Coffee Shop. All Rights Reserved.
      </div>
    </footer>
  );
}