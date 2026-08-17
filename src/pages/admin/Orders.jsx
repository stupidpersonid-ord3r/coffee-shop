import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { supabase } from "../../lib/supabase";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error mengambil orders:", error);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  // Status dibuat fleksibel agar:
  // Pending, PENDING, pending, atau " Pending "
  // tetap mendapatkan warna yang sama.
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

  if (loading) {
    return (
      <MainLayout>
        <section className="max-w-7xl mx-auto px-5 py-24">
          <p className="text-center text-gray-500">
            Memuat pesanan...
          </p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="max-w-7xl mx-auto px-5 py-24">

        {/* Header */}
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

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="border border-gray-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">📦</div>

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

                {/* Order Header */}
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

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    {/* Status Select */}
                    <select
                      value={order.status}
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

                {/* Customer */}
                <div className="py-5 border-b border-gray-200">

                  <h2 className="font-bold text-lg text-gray-900 mb-3">
                    Customer
                  </h2>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">

                    <div>
                      <p className="text-gray-500">
                        Nama
                      </p>

                      <p className="font-medium text-gray-900">
                        {order.customer_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        WhatsApp
                      </p>

                      <p className="font-medium text-gray-900">
                        {order.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Pembayaran
                      </p>

                      <p className="font-medium text-gray-900">
                        {order.payment_method}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4">

                    <p className="text-gray-500 text-sm">
                      Alamat
                    </p>

                    <p className="font-medium text-gray-900">
                      {order.address}
                    </p>

                  </div>

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

                {/* Order Items */}
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
                              {item.products?.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {item.quantity} × Rp{" "}
                              {Number(item.price).toLocaleString(
                                "id-ID"
                              )}
                            </p>

                          </div>

                        </div>

                        <p className="font-semibold text-gray-900">
                          Rp{" "}
                          {(
                            item.price * item.quantity
                          ).toLocaleString("id-ID")}
                        </p>

                      </div>
                    ))}

                  </div>

                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-5 flex justify-between items-center">

                  <span className="text-gray-500">
                    Total Pesanan
                  </span>

                  <span className="text-2xl font-bold text-gray-900">
                    Rp{" "}
                    {Number(order.total).toLocaleString(
                      "id-ID"
                    )}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>
    </MainLayout>
  );
}