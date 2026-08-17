import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <MainLayout>
      <section className="min-h-[70vh] flex flex-col justify-center items-center">
        <h1 className="text-7xl font-bold">404</h1>

        <p className="mt-4 mb-8">
          Halaman tidak ditemukan.
        </p>

        <Link
          to="/"
          className="bg-amber-700 text-white px-6 py-3 rounded-xl"
        >
          Kembali ke Home
        </Link>
      </section>
    </MainLayout>
  );
}