import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Coffee Admin</h1>
        </div>

        <nav className="flex flex-col p-4 gap-2">
          <Link
            to="/admin/dashboard"
            className="rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            Orders
          </Link>

          <button
            onClick={handleLogout}
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}