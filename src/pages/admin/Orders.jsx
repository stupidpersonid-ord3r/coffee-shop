import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { supabase } from "../../lib/supabase";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      // =========================
      // AMBIL ORDERS
      // =========================
      const { data: ordersData, error: ordersError } = await supabase
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
        .order("created_at", { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      // =========================
      // AMBIL PAYMENTS
      // =========================
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*");

      if (paymentsError) {
        throw paymentsError;
      }

      // =========================
      // GABUNGKAN PAYMENT
      // KE MASING-MASING ORDER
      // =========================
      const ordersWithPayment = (ordersData || []).map((order) => ({
        ...order,
        payment:
          paymentsData?.find(
            (payment) => payment.order_id === order.id
          ) || null,
      }));

      setOrders(ordersWithPayment);
    } catch (error) {
      console.error("Error mengambil orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL FETCH
  // =========================
  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // UPDATE ORDER STATUS
  // =========================
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
        })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Error mengubah status:", error);
      alert("Gagal mengubah status pesanan.");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
// VERIFY PAYMENT
// =========================
  // =========================
// VERIFY PAYMENT
// =========================
const verifyPayment = async (orderId) => {
  try {
    setUpdatingId(orderId);

    const paidAt = new Date().toISOString();

    // =========================
    // 1. UPDATE PAYMENT
    // =========================
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        payment_status: "paid",
        paid_at: paidAt,
      })
      .eq("order_id", orderId);

    if (paymentError) {
      throw paymentError;
    }

    // =========================
    // 2. UPDATE ORDER → PROCESSING
    // =========================
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        status: "Processing",
      })
      .eq("id", orderId);

    if (orderError) {
      throw orderError;
    }

    // =========================
    // 3. UPDATE UI
    // =========================
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Processing",
              payment: {
                ...order.payment,
                payment_status: "paid",
                paid_at: paidAt,
              },
            }
          : order
      )
    );

  } catch (error) {
    console.error("Error verifikasi pembayaran:", error);
    alert("Gagal memverifikasi pembayaran.");
  } finally {
    setUpdatingId(null);
  }
};

  // =========================
  // ORDER STATUS CLASS
  // =========================
  const getStatusClass = (status) => {
    const normalizedStatus = status?.trim().toLowerCase();

    switch (normalizedStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "ready":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // PAYMENT STATUS CLASS
  // =========================
  const getPaymentStatusClass = (status) => {
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
  // LOADING
  // =========================
  if (loading) {
    return (
      <MainLayout>
        <section className="max-w-7xl mx-auto px-5 py-24">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin" />

            <p className="text-center text-gray-500 mt-4">
              Memuat pesanan...
            </p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="max-w-7xl mx-auto px-5 py-24">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-10">
          <p className="text-sm font-medium text-amber-700 uppercase tracking-widest mb-2">
            Admin
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Orders
          </h1>

          <p className="text-gray-500 mt-3">
            Kelola pesanan customer yang masuk.
          </p>
        </div>

        {/* =========================
            EMPTY
        ========================= */}
        {orders.length === 0 ? (
          <div className="border border-gray-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">
              📦
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Belum ada pesanan
            </h2>

            <p className="text-gray-500 mt-2">
              Pesanan customer akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm"
              >

                {/* =========================
                    ORDER HEADER
                ========================= */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-gray-200">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="font-semibold text-gray-900 break-all">
                      #{order.order_number || order.id}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                    {/* STATUS BADGE */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    {/* STATUS SELECT */}
                    <select
                      value={order.status || "Pending"}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className="px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Ready">
                        Ready
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>

                  </div>
                </div>

                {/* =========================
                    CUSTOMER
                ========================= */}
                <div className="py-5 border-b border-gray-200">

                  <h2 className="font-bold text-lg text-gray-900 mb-4">
                    Customer
                  </h2>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">

                    {/* NAMA */}
                    <div>
                      <p className="text-gray-500">
                        Nama
                      </p>

                      <p className="font-medium text-gray-900">
                        {order.customer_name || "-"}
                      </p>
                    </div>

                    {/* WHATSAPP */}
                    <div>
                      <p className="text-gray-500">
                        WhatsApp
                      </p>

                      <p className="font-medium text-gray-900">
                        {order.phone || "-"}
                      </p>
                    </div>

                    {/* PAYMENT METHOD */}
                    <div>
                      <p className="text-gray-500">
                        Pembayaran
                      </p>

                      <p className="font-medium text-gray-900">
                        {getPaymentMethodLabel(
                          order.payment?.payment_method
                        )}
                      </p>
                    </div>

                  </div>

                  {/* ALAMAT */}
                  <div className="mt-4">

                    <p className="text-gray-500 text-sm">
                      Alamat
                    </p>

                    <p className="font-medium text-gray-900">
                      {order.address || "-"}
                    </p>

                  </div>

                  {/* CATATAN */}
                  {order.note && (
                    <div className="mt-4">

                      <p className="text-gray-500 text-sm">
                        Catatan
                      </p>

                      <p className="font-medium text-gray-900">
                        {order.note}
                      </p>

                    </div>
                  )}

                </div>

                {/* =========================
                    PAYMENT
                ========================= */}
                <div className="py-5 border-b border-gray-200">

                  <h2 className="font-bold text-lg text-gray-900 mb-4">
                    Pembayaran
                  </h2>

                  <div className="grid md:grid-cols-3 gap-4">

                    {/* METODE */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Metode Pembayaran
                      </p>

                      <p className="font-semibold text-gray-900 mt-1">
                        {getPaymentMethodLabel(
                          order.payment?.payment_method
                        )}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Status Pembayaran
                      </p>

                      <span
                        className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusClass(
                          order.payment?.payment_status
                        )}`}
                      >
                        {getPaymentStatusLabel(
                          order.payment?.payment_status
                        )}
                      </span>
                    </div>

                    {/* AMOUNT */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Jumlah Pembayaran
                      </p>

                      <p className="font-semibold text-gray-900 mt-1">
                        Rp{" "}
                        {Number(
                          order.payment?.amount || order.total || 0
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>

                  </div>

                  {/* SENDER INFO */}
                  {order.payment?.sender_name && (
                    <div className="mt-5 p-4 rounded-xl bg-gray-50">

                      <p className="text-sm text-gray-500">
                        Nama Pengirim
                      </p>

                      <p className="font-semibold text-gray-900 mt-1">
                        {order.payment.sender_name}
                      </p>

                      {order.payment?.sender_account && (
                        <>
                          <p className="text-sm text-gray-500 mt-3">
                            Nomor Rekening / Akun
                          </p>

                          <p className="font-semibold text-gray-900 mt-1">
                            {order.payment.sender_account}
                          </p>
                        </>
                      )}

                    </div>
                  )}

                </div>

                {/* =========================
    ORDER ITEMS
========================= */}
<div className="py-5">

  <h2 className="font-bold text-lg text-gray-900 mb-4">
    Pesanan
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
              {Number(item.price).toLocaleString("id-ID")}
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

{/* =========================
    TOTAL & PAYMENT STATUS
========================= */}
<div className="border-t border-gray-200 pt-5">

  {/* TOTAL */}
  <div className="flex justify-between items-center">

    <span className="text-gray-500">
      Total Pesanan
    </span>

    <span className="text-2xl font-bold text-gray-900">
      Rp{" "}
      {Number(order.total).toLocaleString("id-ID")}
    </span>

  </div>

  {/* PAYMENT STATUS */}
  <div className="mt-5 pt-5 border-t border-gray-100">

    <p className="text-sm text-gray-500 mb-2">
      Status Pembayaran
    </p>

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

      <span
        className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusClass(
          order.payment?.payment_status
        )}`}
      >
        {getPaymentStatusLabel(
          order.payment?.payment_status
        )}
      </span>

      {/* VERIFY PAYMENT */}
      {order.payment?.payment_status ===
        "waiting_verification" && (
        <button
          onClick={() => verifyPayment(order.id)}
          disabled={updatingId === order.id}
          className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updatingId === order.id
            ? "Memverifikasi..."
            : "✓ Verifikasi Pembayaran"}
        </button>
      )}

    </div>

  </div>

</div>

              </div>
            ))}

          </div>
        )}

      </section>
    </MainLayout>
  );
}