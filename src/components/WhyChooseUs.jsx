import {
  FaCoffee,
  FaLeaf,
  FaWifi,
  FaSmile,
} from "react-icons/fa";

const features = [
  {
    icon: <FaCoffee size={32} />,
    title: "Premium Coffee",
    desc: "Menggunakan biji kopi pilihan terbaik.",
  },
  {
    icon: <FaLeaf size={32} />,
    title: "Fresh Ingredients",
    desc: "Semua bahan selalu segar setiap hari.",
  },
  {
    icon: <FaWifi size={32} />,
    title: "Free WiFi",
    desc: "Nyaman untuk bekerja maupun belajar.",
  },
  {
    icon: <FaSmile size={32} />,
    title: "Friendly Service",
    desc: "Pelayanan ramah dengan barista profesional.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-5">

        <div className="text-center">

          <span className="text-amber-700 font-semibold uppercase">
            Why Choose Us?
          </span>

          <h2 className="text-4xl font-bold mt-3">
            Mengapa Memilih Kami?
          </h2>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              <div className="text-amber-700 flex justify-center">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mt-5">
                {item.title}
              </h3>

              <p className="mt-3 text-stone-500">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}