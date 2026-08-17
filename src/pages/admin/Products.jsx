import { useEffect, useState } from "react";
import { productService } from "../../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);

      const data = await productService.getAll();

      setProducts(data);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <button className="bg-black text-white px-4 py-2 rounded-lg">
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Available</th>
              <th className="p-4 text-left">Best Seller</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t"
              >
                <td className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </td>

                <td className="p-4 font-medium">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.category}
                </td>

                <td className="p-4">
                  Rp {product.price.toLocaleString("id-ID")}
                </td>

                <td className="p-4">
                  {product.is_available ? "✅" : "❌"}
                </td>

                <td className="p-4">
                  {product.bestseller ? "⭐" : "-"}
                </td>

                <td className="p-4">
                  <div className="flex gap-2 justify-center">

                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}