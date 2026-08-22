import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaWhatsapp,
  FaArrowRight,
  FaPaperPlane,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaGift,
  FaUserPlus,
} from "react-icons/fa";

export default function Contact() {
  const navigate = useNavigate();

  // =========================
  // WHATSAPP MODAL
  // =========================
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  const [email, setEmail] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [customer, setCustomer] = useState(null);

  // =========================
  // REGISTER PROMO MODAL
  // =========================
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerSource, setRegisterSource] = useState("");

  // =========================
  // CONTACT FORM
  // =========================
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // =========================
  // HANDLE FORM INPUT
  // =========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  // =========================
  // OPEN REGISTER MODAL
  // =========================
  const openRegisterModal = (source) => {
    setRegisterSource(source);
    setShowRegisterModal(true);
  };

  // =========================
  // CLOSE REGISTER MODAL
  // =========================
  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setRegisterSource("");
  };

  // =========================
  // GO TO REGISTER
  // =========================
  const handleGoRegister = () => {
    closeRegisterModal();

    navigate("/register", {
      state: {
        email:
          registerSource === "contact"
            ? formData.email.trim().toLowerCase()
            : email.trim().toLowerCase(),
      },
    });
  };

  // =========================
  // SEND EMAIL
  // =========================
  const handleSendEmail = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const emailValue = formData.email.trim().toLowerCase();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    setFormError("");

    // =========================
    // VALIDASI FIELD
    // =========================
    if (!name || !emailValue || !subject || !message) {
      setFormError(
        "Mohon lengkapi semua field sebelum mengirim pesan."
      );
      return;
    }

    // =========================
    // VALIDASI EMAIL
    // =========================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      setFormError("Format email yang Anda masukkan tidak valid.");
      return;
    }

    try {
      setCheckingEmail(true);

      // =========================
      // CEK EMAIL KE SUPABASE
      // =========================
      const { data, error } = await supabase
        .from("customer_emails")
        .select("id, customer_name, email")
        .eq("email", emailValue)
        .maybeSingle();

      console.log("CONTACT EMAIL CHECK:", emailValue);
      console.log("CUSTOMER DATA:", data);
      console.log("SUPABASE ERROR:", error);

      // =========================
      // SUPABASE ERROR
      // =========================
      if (error) {
        console.error("Supabase error:", error);

        setFormError(
          "Email tidak dapat diverifikasi. Silakan coba lagi."
        );

        return;
      }

      // =========================
      // EMAIL BELUM TERDAFTAR
      // =========================
      if (!data) {
        setCheckingEmail(false);

        openRegisterModal("contact");

        return;
      }

      // =========================
      // EMAIL TERDAFTAR
      // =========================
      const emailSubject = encodeURIComponent(subject);

      const emailBody = encodeURIComponent(
        `Halo R&A.co,\n\n` +
          `Nama: ${name}\n` +
          `Email: ${emailValue}\n\n` +
          `Pesan:\n${message}\n\n` +
          `Terima kasih.`
      );

      window.location.href =
        `mailto:hello@coffeeshop.com` +
        `?subject=${emailSubject}` +
        `&body=${emailBody}`;
    } catch (err) {
      console.error("Email verification error:", err);

      setFormError(
        "Terjadi kesalahan saat memverifikasi email. Silakan coba lagi."
      );
    } finally {
      setCheckingEmail(false);
    }
  };

  // =========================
  // OPEN WHATSAPP MODAL
  // =========================
  const handleOpenWhatsapp = () => {
    setShowWhatsappModal(true);
    setEmail("");
    setEmailVerified(false);
    setEmailError("");
    setCustomer(null);
  };

  // =========================
  // CLOSE WHATSAPP MODAL
  // =========================
  const handleCloseWhatsapp = () => {
    if (checkingEmail) return;

    setShowWhatsappModal(false);
    setEmail("");
    setEmailVerified(false);
    setEmailError("");
    setCustomer(null);
  };

  // =========================
  // VERIFY EMAIL WHATSAPP
  // =========================
  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    setEmailError("");
    setEmailVerified(false);
    setCustomer(null);

    // =========================
    // EMPTY EMAIL
    // =========================
    if (!normalizedEmail) {
      setEmailError("Masukkan email terlebih dahulu.");
      return;
    }

    // =========================
    // EMAIL FORMAT
    // =========================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setEmailError("Format email tidak valid.");
      return;
    }

    try {
      setCheckingEmail(true);

      const { data, error } = await supabase
        .from("customer_emails")
        .select("id, customer_name, email, phone")
        .eq("email", normalizedEmail)
        .maybeSingle();

      console.log("EMAIL CHECK:", normalizedEmail);
      console.log("CUSTOMER DATA:", data);
      console.log("SUPABASE ERROR:", error);

      // =========================
      // SUPABASE ERROR
      // =========================
      if (error) {
        console.error("Supabase error:", error);

        setEmailError(
          "Email tidak dapat diverifikasi. Silakan coba lagi."
        );

        return;
      }

      // =========================
      // EMAIL BELUM TERDAFTAR
      // =========================
      if (!data) {
        setEmailError("");

        setCheckingEmail(false);

        openRegisterModal("whatsapp");

        return;
      }

      // =========================
      // EMAIL DITEMUKAN
      // =========================
      setCustomer(data);
      setEmailVerified(true);
    } catch (err) {
      console.error("Verification error:", err);

      setEmailError(
        "Terjadi kesalahan saat memeriksa email. Silakan coba lagi."
      );
    } finally {
      setCheckingEmail(false);
    }
  };

  // =========================
  // CONTINUE TO WHATSAPP
  // =========================
  const handleContinueWhatsapp = () => {
    if (!emailVerified || !customer) return;

    const customerName =
      customer.customer_name || "Customer";

    const message = encodeURIComponent(
      `Halo R&A.co 👋\n\n` +
        `Saya ${customerName}.\n` +
        `Email saya: ${customer.email}\n\n` +
        `Saya ingin menghubungi R&A.co untuk informasi lebih lanjut.`
    );

    window.open(
      `https://wa.me/6281234567890?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );

    handleCloseWhatsapp();
  };

  return (
    <MainLayout>
      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-amber-950 to-stone-900 text-white">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-orange-700/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />

              <span className="text-sm font-medium text-amber-100">
                Kami siap membantu Anda
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Mari Terhubung
              <span className="block text-amber-400">
                Bersama R&A.co
              </span>
            </h1>

            <p className="text-stone-300 text-base md:text-lg leading-relaxed max-w-2xl">
              Punya pertanyaan, ingin melakukan reservasi, atau
              ingin bekerja sama? Tim kami dengan senang hati siap
              membantu Anda.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-amber-900/30 hover:-translate-y-1"
              >
                Kirim Pesan
                <FaArrowRight />
              </a>

              <button
                type="button"
                onClick={handleOpenWhatsapp}
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                <FaWhatsapp className="text-green-400 text-xl" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CONTACT CONTENT
      ========================== */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
            {/* =========================
                CONTACT INFO
            ========================== */}
            <div className="lg:col-span-2">
              <span className="inline-block text-amber-700 font-bold text-sm uppercase tracking-[0.2em] mb-3">
                Contact Us
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-5">
                Kami Senang
                <span className="text-amber-700">
                  {" "}
                  Mendengar Anda
                </span>
              </h2>

              <p className="text-stone-600 leading-relaxed mb-8">
                Jangan ragu untuk menghubungi kami. Baik untuk
                sekadar bertanya tentang menu, melakukan reservasi,
                maupun membicarakan kerja sama.
              </p>

              <div className="space-y-4">
                {/* ADDRESS */}
                <div className="group flex gap-5 bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-700 transition-colors duration-300">
                    <FaMapMarkerAlt className="text-xl text-amber-700 group-hover:text-white transition-colors" />
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 mb-1">
                      Alamat
                    </h3>

                    <p className="text-stone-600 text-sm leading-relaxed">
                      Jl. Sudirman No.123
                      <br />
                      Jakarta Pusat, Indonesia
                    </p>
                  </div>
                </div>

                {/* PHONE */}
                <a
                  href="tel:+6281234567890"
                  className="group flex gap-5 bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-700 transition-colors duration-300">
                    <FaPhoneAlt className="text-lg text-amber-700 group-hover:text-white transition-colors" />
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 mb-1">
                      Telepon
                    </h3>

                    <p className="text-stone-600 text-sm">
                      +62 812 3456 7890
                    </p>
                  </div>
                </a>

                {/* EMAIL */}
                <a
                  href="mailto:hello@coffeeshop.com"
                  className="group flex gap-5 bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-700 transition-colors duration-300">
                    <FaEnvelope className="text-lg text-amber-700 group-hover:text-white transition-colors" />
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 mb-1">
                      Email
                    </h3>

                    <p className="text-stone-600 text-sm">
                      hello@coffeeshop.com
                    </p>
                  </div>
                </a>

                {/* HOURS */}
                <div className="group flex gap-5 bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-700 transition-colors duration-300">
                    <FaClock className="text-lg text-amber-700 group-hover:text-white transition-colors" />
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 mb-1">
                      Jam Operasional
                    </h3>

                    <div className="text-stone-600 text-sm space-y-1">
                      <p>Senin - Jumat : 08.00 - 22.00</p>
                      <p>Sabtu - Minggu : 09.00 - 23.00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WHATSAPP CTA */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <FaWhatsapp className="text-white text-2xl" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-stone-900">
                      Butuh respon cepat?
                    </h3>

                    <p className="text-sm text-stone-600">
                      Verifikasi email Anda untuk melanjutkan ke
                      WhatsApp.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenWhatsapp}
                  className="mt-4 flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition"
                >
                  Verifikasi & WhatsApp
                  <FaArrowRight />
                </button>
              </div>
            </div>

            {/* =========================
                EMAIL FORM
            ========================== */}
            <div
              id="contact-form"
              className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-stone-100 p-7 md:p-10"
            >
              <div className="mb-8">
                <span className="inline-block text-amber-700 font-bold text-sm uppercase tracking-[0.2em] mb-3">
                  Send Message
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-3">
                  Kirim Pesan
                </h2>

                <p className="text-stone-500">
                  Email Anda akan diverifikasi terlebih dahulu
                  sebelum dapat mengirim pesan.
                </p>
              </div>

              <form
                onSubmit={handleSendEmail}
                className="space-y-6"
              >
                {/* NAME + EMAIL */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Nama Lengkap
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama Anda"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="nama@email.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* SUBJECT */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Subjek
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Apa yang ingin Anda sampaikan?"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Pesan
                  </label>

                  <textarea
                    rows="6"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition resize-none"
                  />
                </div>

                {/* ERROR */}
                {formError && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <FaExclamationCircle className="text-red-500 text-sm" />
                    </div>

                    <div>
                      <p className="font-semibold text-red-800 text-sm">
                        Pesan belum dapat dikirim
                      </p>

                      <p className="text-red-600 text-sm mt-1">
                        {formError}
                      </p>
                    </div>
                  </div>
                )}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={checkingEmail}
                  className="group w-full flex items-center justify-center gap-3 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-amber-900/20 hover:-translate-y-0.5"
                >
                  {checkingEmail ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Memverifikasi Email...
                    </>
                  ) : (
                    <>
                      Kirim ke Email
                      <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    {/* =========================
    LOCATION MAP
========================= */}
<section className="bg-white py-20 md:py-24">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <div className="text-center mb-12">
      <span className="inline-block text-amber-700 font-bold text-sm uppercase tracking-[0.2em] mb-3">
        Find Us
      </span>

      <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 mb-4">
        Temukan Kami
      </h2>

      <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed">
        Kunjungi R&A.co dan nikmati secangkir kopi favorit Anda
        dalam suasana yang nyaman dan hangat.
      </p>
    </div>

    {/* MAP */}
    <div className="relative group">

      {/* Glow */}
      <div className="absolute -inset-3 bg-amber-200/30 rounded-[2rem] blur-2xl" />

      {/* Map Container */}
      <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border border-stone-200 bg-stone-100">

        {/* Open Maps Button */}
        <a
          href="https://www.google.com/maps/search/?api=1&query=Monas+Jakarta"
          target="_blank"
          rel="noopener noreferrer"
          className="
            absolute
            z-20
            top-5
            right-5
            bg-white
            hover:bg-amber-700
            text-stone-900
            hover:text-white
            px-4
            py-2.5
            rounded-xl
            text-sm
            font-semibold
            shadow-lg
            border
            border-stone-200
            transition-all
            duration-300
            hover:-translate-y-0.5
          "
        >
          Buka di Google Maps
        </a>

        {/* Google Maps */}
        <div className="relative w-full h-[430px] md:h-[520px]">

          <iframe
            title="R&A.co Coffee Shop Location"
            src="https://www.google.com/maps?q=Monas%20Jakarta&z=15&output=embed"
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  </div>
</section>

      {/* =========================
          WHATSAPP MODAL
      ========================== */}
      {showWhatsappModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseWhatsapp}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <FaWhatsapp className="text-2xl" />
                  </div>

                  <h2 className="text-2xl font-extrabold">
                    Verifikasi Email
                  </h2>

                  <p className="text-green-50 text-sm mt-2 leading-relaxed">
                    Masukkan email yang sudah terdaftar sebelum
                    melanjutkan ke WhatsApp.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseWhatsapp}
                  disabled={checkingEmail}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition disabled:opacity-50"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="p-6">
              <form
                onSubmit={handleVerifyEmail}
                className="space-y-4"
              >
                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Email Terdaftar
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setEmailVerified(false);
                      setCustomer(null);
                    }}
                    placeholder="contoh@email.com"
                    disabled={checkingEmail || emailVerified}
                    autoFocus
                    className={`w-full bg-stone-50 border rounded-xl px-4 py-3.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition ${
                      emailError
                        ? "border-red-300 focus:ring-red-500"
                        : emailVerified
                        ? "border-green-400 focus:ring-green-500"
                        : "border-stone-200 focus:ring-green-600"
                    } disabled:opacity-70`}
                  />
                </div>

                {/* ERROR */}
                {emailError && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                    <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />

                    <p className="text-sm text-red-700 leading-relaxed">
                      {emailError}
                    </p>
                  </div>
                )}

                {/* SUCCESS */}
                {emailVerified && customer && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 text-lg mt-0.5 flex-shrink-0" />

                      <div>
                        <p className="font-bold text-green-800">
                          Email terverifikasi
                        </p>

                        <p className="text-sm text-green-700 mt-1">
                          Selamat datang,{" "}
                          <span className="font-semibold">
                            {customer.customer_name ||
                              "Customer"}
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* VERIFY BUTTON */}
                {!emailVerified && (
                  <button
                    type="submit"
                    disabled={checkingEmail}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-green-900/10"
                  >
                    {checkingEmail ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Memeriksa Email...
                      </>
                    ) : (
                      <>
                        Verifikasi Email
                        <FaCheckCircle />
                      </>
                    )}
                  </button>
                )}

                {/* CONTINUE BUTTON */}
                {emailVerified && customer && (
                  <button
                    type="button"
                    onClick={handleContinueWhatsapp}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-green-900/20"
                  >
                    Lanjut ke WhatsApp
                    <FaWhatsapp className="text-xl" />
                  </button>
                )}
              </form>

              <p className="text-xs text-center text-stone-400 mt-5">
                Email Anda digunakan hanya untuk proses verifikasi
                customer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          REGISTER PROMO MODAL
      ========================== */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeRegisterModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* TOP */}
            <div className="relative bg-gradient-to-br from-amber-700 via-orange-700 to-amber-900 text-white p-7">
              <button
                type="button"
                onClick={closeRegisterModal}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                <FaGift className="text-2xl text-amber-200" />
              </div>

              <p className="text-amber-200 text-sm font-bold uppercase tracking-wider">
                Member R&A.co
              </p>

              <h2 className="text-2xl md:text-3xl font-extrabold mt-2 leading-tight">
                Email Belum Terdaftar
              </h2>

              <p className="text-amber-50 text-sm mt-3 leading-relaxed">
                Sepertinya Anda belum memiliki akun R&A.co.
                Jangan lewatkan promo khusus member baru!
              </p>
            </div>

            {/* BODY */}
            <div className="p-7">
              {/* PROMO CARD */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-5 mb-6">
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-amber-200/40" />

                <div className="relative flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                    <FaGift />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Welcome Reward
                    </p>

                    <h3 className="text-xl font-extrabold text-stone-900 mt-1">
                      Promo Member Baru
                    </h3>

                    <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                      Buat akun R&A.co dan dapatkan promo spesial
                      untuk pembelian pertama Anda.
                    </p>
                  </div>
                </div>
              </div>

              {/* INFO */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <FaUserPlus className="text-amber-700 text-sm" />
                </div>

                <div>
                  <p className="font-bold text-stone-900 text-sm">
                    Belum punya akun?
                  </p>

                  <p className="text-stone-500 text-sm mt-1 leading-relaxed">
                    Daftar sekarang agar bisa mendapatkan promo
                    dan menikmati fitur member R&A.co.
                  </p>
                </div>
              </div>

              {/* REGISTER */}
              <button
                type="button"
                onClick={handleGoRegister}
                className="w-full flex items-center justify-center gap-3 bg-amber-700 hover:bg-amber-800 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-amber-900/20 hover:-translate-y-0.5"
              >
                Daftar Akun Sekarang
                <FaArrowRight />
              </button>

              {/* LATER */}
              <button
                type="button"
                onClick={closeRegisterModal}
                className="w-full mt-3 py-3 rounded-xl font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition"
              >
                Nanti
              </button>

              <p className="text-xs text-center text-stone-400 mt-4">
                Gratis membuat akun. Tidak ada biaya pendaftaran.
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}