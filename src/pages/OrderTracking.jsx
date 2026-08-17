import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";

export default function OrderTracking() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [notification, setNotification] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // =========================
  // STATUS STEPS
  // =========================
  const statusSteps = [
    {
      status: "Pending",
      title: "Pesanan diterima",
      description: "Pesanan kamu sudah berhasil diterima.",
      icon: "📋",
    },
    {
      status: "Processing",
      title: "Pesanan sedang diproses",
      description: "Pesanan kamu sedang disiapkan.",
      icon: "☕",
    },
    {
      status: "Ready",
      title: "Pesanan siap",
      description: "Pesanan kamu sudah siap diambil atau dikirim.",
      icon: "✨",
    },
    {
      status: "Completed",
      title: "Pesanan selesai",
      description: "Pesanan kamu sudah selesai.",
      icon: "🎉",
    },
  ];

  // =========================
  // PAYMENT METHOD LABEL
  // =========================
  const getPaymentMethodLabel = (method) => {
    const normalizedMethod = method?.trim().toLowerCase();

    switch (normalizedMethod) {
      case "cash":
        return "Cash";

      case "transfer":
        return "Transfer Bank";

      case "qris":
        return "QRIS";

      default:
        return method || "-";
    }
  };

  // =========================
  // PAYMENT STATUS LABEL
  // =========================
  const getPaymentStatusLabel = (status) => {
    const normalizedStatus = status?.trim().toLowerCase();

    switch (normalizedStatus) {
      case "paid":
        return "Pembayaran Berhasil";

      case "waiting_verification":
        return "Menunggu Verifikasi";

      case "pending":
        return "Menunggu Pembayaran";

      case "failed":
        return "Pembayaran Gagal";

      default:
        return status || "-";
    }
  };

  // =========================
  // PAYMENT STATUS COLOR
  // =========================
  const getPaymentStatusColor = (status) => {
    const normalizedStatus = status?.trim().toLowerCase();

    switch (normalizedStatus) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "waiting_verification":
        return "bg-yellow-100 text-yellow-700";

      case "pending":
        return "bg-gray-100 text-gray-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // FETCH ORDER
  // =========================
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // =========================
      // AMBIL ORDER
      // =========================
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              name,
              image
            )
          )
        `)
        .eq("id", orderId)
        .single();

      if (orderError) {
        throw orderError;
      }

      if (!orderData) {
        throw new Error("Pesanan tidak ditemukan.");
      }

      // =========================
      // AMBIL PAYMENT
      // =========================
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("order_id", orderId)
        .maybeSingle();

      if (paymentError) {
        console.error(
          "Error mengambil payment:",
          paymentError
        );
      }

      setOrder(orderData);
      setPayment(paymentData || null);
    } catch (error) {
      console.error("Error mengambil order:", error);

      setError("Pesanan tidak ditemukan.");
      setOrder(null);
      setPayment(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL FETCH
  // =========================
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // =========================
  // COPY ORDER NUMBER
  // =========================
  const handleCopyOrderNumber = async () => {
    if (!order?.order_number) return;

    try {
      await navigator.clipboard.writeText(
        order.order_number
      );

      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Gagal menyalin kode:",
        error
      );
    }
  };

  // =========================
  // REALTIME ORDER
  // =========================
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log(
            "Realtime order update:",
            payload.new
          );

          const newStatus = payload.new.status;

          setOrder((prevOrder) => ({
            ...prevOrder,
            ...payload.new,
          }));

          // =========================
          // STATUS BERUBAH
          // =========================
          if (payload.old?.status !== newStatus) {
            const normalizedStatus =
              newStatus?.trim().toLowerCase();

            const step = statusSteps.find(
              (item) =>
                item.status.toLowerCase() ===
                normalizedStatus
            );

            if (step) {
              setNotification({
                title: step.title,
                description: step.description,
                icon: step.icon,
              });

              setTimeout(() => {
                setNotification(null);
              }, 5000);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log(
          "Order realtime status:",
          status
        );
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // =========================
  // AUTO REFRESH ORDER STATUS
  // =========================
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              name,
              image
            )
          )
        `)
        .eq("id", orderId)
        .single();

      if (!error && data) {
        setOrder((prevOrder) => {
          if (
            prevOrder &&
            prevOrder.status !== data.status
          ) {
            console.log(
              "Order status berubah:",
              prevOrder.status,
              "→",
              data.status
            );
          }

          return data;
        });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [orderId]);

  // =========================
  // REALTIME PAYMENT
  // =========================
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`payment-tracking-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "payments",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          console.log(
            "Realtime payment update:",
            payload.new
          );

          const newPayment = payload.new;

          setPayment(newPayment);

          // =========================
          // PAYMENT BERHASIL
          // =========================
          if (
            payload.old?.payment_status !==
            newPayment.payment_status
          ) {
            if (
              newPayment.payment_status === "paid"
            ) {
              setNotification({
                title: "Pembayaran berhasil",
                description:
                  "Pembayaran kamu sudah dikonfirmasi.",
                icon: "✓",
              });

              setTimeout(() => {
                setNotification(null);
              }, 5000);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log(
          "Payment realtime status:",
          status
        );
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // =========================
  // STATUS INDEX
  // =========================
  const currentStatusIndex = order
    ? statusSteps.findIndex(
        (step) =>
          step.status.toLowerCase() ===
          order.status?.trim().toLowerCase()
      )
    : -1;

  // =========================
  // ORDER STATUS COLOR
  // =========================
  const getStatusColor = (status) => {
    const normalizedStatus =
      status?.trim().toLowerCase();

    switch (normalizedStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "ready":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <MainLayout>
        <section className="max-w-5xl mx-auto px-5 py-24">
          <div className="flex flex-col items-center justify-center">

            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin" />

            <p className="text-gray-500 mt-5">
              Memuat pesanan...
            </p>

          </div>
        </section>
      </MainLayout>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error || !order) {
    return (
      <MainLayout>
        <section className="max-w-5xl mx-auto px-5 py-24">

          <div className="border border-gray-200 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              📦
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Pesanan tidak ditemukan
            </h1>

            <p className="text-gray-500 mt-2">
              Pastikan link pesanan yang kamu buka benar.
            </p>

          </div>

        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      {/* =========================
          COPY SUCCESS NOTIFICATION
      ========================= */}
      {copySuccess && (
        <div className="fixed top-24 right-5 z-50 w-[calc(100%-40px)] max-w-sm">

          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg shrink-0">
                ✓
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Kode berhasil disalin
                </p>

                <p className="text-sm text-gray-500 mt-0.5">
                  Kode pesanan sudah tersalin ke clipboard.
                </p>
              </div>

              <button
                onClick={() => setCopySuccess(false)}
                className="ml-auto text-gray-400 hover:text-gray-700 text-xl transition"
              >
                ×
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================
          REALTIME NOTIFICATION
      ========================= */}
      {notification && (
        <div className="fixed top-24 right-5 z-50 w-[calc(100%-40px)] max-w-sm">

          <div className="bg-white border border-green-200 shadow-2xl rounded-2xl p-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl shrink-0">
                {notification.icon}
              </div>

              <div className="flex-1">

                <p className="text-xs uppercase tracking-widest font-semibold text-green-600">
                  Update Pesanan
                </p>

                <h3 className="font-bold text-gray-900 mt-1">
                  {notification.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {notification.description}
                </p>

              </div>

              <button
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>

            </div>

          </div>

        </div>
      )}

      <section className="max-w-5xl mx-auto px-5 py-24">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-10">

          <p className="text-sm font-medium text-amber-700 uppercase tracking-widest mb-2">
            Order Tracking
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Lacak Pesanan
          </h1>

          <p className="text-gray-500 mt-3">
            Pantau status pesanan kamu secara realtime.
          </p>

        </div>

        {/* =========================
            ORDER INFO
        ========================= */}
        <div className="border border-gray-200 rounded-2xl p-6 md:p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-sm text-gray-500">
                Order ID
              </p>

              <div className="flex items-center gap-2 mt-1">

                <p className="font-semibold text-gray-900">
                  #{order.order_number}
                </p>

                <button
                  onClick={handleCopyOrderNumber}
                  className="
                    inline-flex items-center gap-1.5
                    px-3 py-1.5
                    rounded-lg
                    bg-gray-100
                    hover:bg-amber-100
                    text-gray-600
                    hover:text-amber-700
                    text-xs font-semibold
                    transition-all duration-200
                    active:scale-95
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="11"
                      height="11"
                      rx="2"
                    />

                    <path
                      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                    />
                  </svg>

                  Salin
                </button>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.created_at).toLocaleString(
                  "id-ID"
                )}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Status Saat Ini
              </p>

              <span
                className={`inline-flex items-center mt-1 px-4 py-2 rounded-full font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />

                {order.status}
              </span>

            </div>

          </div>

        </div>

        {/* =========================
            STATUS TIMELINE
        ========================= */}
        <div className="border border-gray-200 rounded-2xl p-6 md:p-8 mb-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Status Pesanan
          </h2>

          <div className="space-y-8">

            {statusSteps.map((step, index) => {

              const isCompleted =
                index < currentStatusIndex;

              const isActive =
                index === currentStatusIndex;

              return (
                <div
                  key={step.status}
                  className="flex gap-4"
                >

                  {/* ICON */}
                  <div className="flex flex-col items-center">

                    <div
                      className={`
                        w-12 h-12 rounded-full
                        flex items-center justify-center
                        text-lg
                        transition-all duration-500
                        ${
                          isCompleted
                            ? "bg-green-600 text-white"
                            : isActive
                            ? "bg-amber-700 text-white scale-110 shadow-lg shadow-amber-200"
                            : "bg-gray-100 text-gray-400"
                        }
                      `}
                    >
                      {isCompleted
                        ? "✓"
                        : step.icon}
                    </div>

                    {index !== statusSteps.length - 1 && (
                      <div
                        className={`
                          w-0.5 h-12 mt-2
                          transition-all duration-500
                          ${
                            isCompleted
                              ? "bg-green-600"
                              : "bg-gray-200"
                          }
                        `}
                      />
                    )}

                  </div>

                  {/* TEXT */}
                  <div className="pt-1">

                    <h3
                      className={`
                        font-semibold
                        ${
                          isActive || isCompleted
                            ? "text-gray-900"
                            : "text-gray-400"
                        }
                      `}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`
                        text-sm mt-1
                        ${
                          isActive || isCompleted
                            ? "text-gray-500"
                            : "text-gray-400"
                        }
                      `}
                    >
                      {step.description}
                    </p>

                    {isActive && (
                      <span className="inline-flex items-center gap-2 mt-2 text-xs font-medium text-amber-700">

                        <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />

                        Status saat ini

                      </span>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* =========================
            CUSTOMER
        ========================= */}
        <div className="border border-gray-200 rounded-2xl p-6 md:p-8 mb-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Informasi Pesanan
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* NAMA */}
            <div>

              <p className="text-sm text-gray-500">
                Nama
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {order.customer_name || "-"}
              </p>

            </div>

            {/* WHATSAPP */}
            <div>

              <p className="text-sm text-gray-500">
                WhatsApp
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {order.phone || "-"}
              </p>

            </div>

            {/* PAYMENT METHOD */}
            <div>

              <p className="text-sm text-gray-500">
                Pembayaran
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {getPaymentMethodLabel(
                  payment?.payment_method
                )}
              </p>

            </div>

            {/* PAYMENT STATUS */}
            <div>

              <p className="text-sm text-gray-500">
                Status Pembayaran
              </p>

              <span
                className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                  payment?.payment_status
                )}`}
              >
                {getPaymentStatusLabel(
                  payment?.payment_status
                )}
              </span>

            </div>

            {/* TOTAL */}
            <div>

              <p className="text-sm text-gray-500">
                Total
              </p>

              <p className="font-bold text-gray-900 mt-1">
                Rp{" "}
                {Number(order.total).toLocaleString(
                  "id-ID"
                )}
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            ITEMS
        ========================= */}
        <div className="border border-gray-200 rounded-2xl p-6 md:p-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Detail Pesanan
          </h2>

          <div className="space-y-4">

            {order.order_items?.map((item) => (

              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >

                {/* PRODUCT */}
                <div className="flex items-center gap-3">

                  {item.products?.image && (
                    <img
                      src={item.products.image}
                      alt={item.products.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                  )}

                  <div>

                    <p className="font-medium text-gray-900">
                      {item.products?.name || "Produk"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.quantity} × Rp{" "}
                      {Number(item.price).toLocaleString(
                        "id-ID"
                      )}
                    </p>

                  </div>

                </div>

                {/* SUBTOTAL */}
                <p className="font-semibold text-gray-900 whitespace-nowrap">

                  Rp{" "}
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString("id-ID")}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =========================
          ANIMATION
      ========================= */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(30px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

    </MainLayout>
  );
}