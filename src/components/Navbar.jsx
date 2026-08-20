import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaCoffee,
  FaBars,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { cart } = useCart();

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const menus = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Menu",
      path: "/menu",
    },
    {
      name: "Our Story",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
    {
      name: "Find Order",
      path: "/find-order",
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg py-3"
          : "bg-white/80 backdrop-blur-md py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <FaCoffee className="text-amber-700 text-3xl" />

          <span className="font-bold text-2xl text-stone-900">
            R&A.co
          </span>
        </Link>

        {/* =========================
            Desktop Menu
        ========================= */}
        <ul className="hidden md:flex items-center gap-8 font-medium">

          {menus.map((menu) => (
            <li key={menu.name}>
              <NavLink
                to={menu.path}
                className={({ isActive }) =>
                  `transition hover:text-amber-700 ${
                    isActive
                      ? "text-amber-700 font-semibold"
                      : "text-stone-700"
                  }`
                }
              >
                {menu.name}
              </NavLink>
            </li>
          ))}

        </ul>

        {/* =========================
            Desktop Right
        ========================= */}
        <div className="hidden md:flex items-center gap-5">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative"
          >
            <FaShoppingCart className="text-2xl text-stone-800 hover:text-amber-700 transition" />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Order */}
          <Link
            to="/menu"
            className="bg-amber-700 text-white px-5 py-2 rounded-xl hover:bg-amber-800 transition"
          >
            Order Now
          </Link>

        </div>

        {/* =========================
            Mobile Button
        ========================= */}
        <button
          className="md:hidden text-2xl text-stone-800"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* =========================
          Mobile Menu
      ========================= */}
      {open && (
        <div className="md:hidden bg-white shadow-xl border-t border-gray-200">

          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-4 border-b transition ${
                  isActive
                    ? "bg-amber-50 text-amber-700 font-semibold"
                    : "hover:bg-gray-50"
                }`
              }
            >
              {menu.name}
            </NavLink>
          ))}

          {/* Cart */}
          <NavLink
            to="/cart"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-6 py-4 border-b ${
                isActive
                  ? "bg-amber-50 text-amber-700 font-semibold"
                  : ""
              }`
            }
          >
            <span>Keranjang</span>

            {totalItems > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </NavLink>

          {/* Order Button */}
          <div className="p-5">
            <Link
              to="/menu"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-amber-700 text-white py-3 rounded-xl hover:bg-amber-800 transition"
            >
              Order Now
            </Link>
          </div>

        </div>
      )}
    </nav>
  );
}