import { supabase } from "../lib/supabase";

export async function getBestSellers() {
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      quantity,
      product_id,
      products (
        id,
        name,
        price,
        image,
        category
      ),
      orders!inner (
        status
      )
    `)
    .eq("orders.status", "Completed");

  if (error) {
    console.error("Error mengambil best seller:", error);
    return [];
  }

  const productSales = {};

  data.forEach((item) => {
    const product = item.products;

    if (!product) return;

    if (!productSales[product.id]) {
      productSales[product.id] = {
        ...product,
        totalSold: 0,
      };
    }

    productSales[product.id].totalSold += item.quantity;
  });

  const products = Object.values(productSales);

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ];

  const bestSellers = [];

  categories.forEach((category) => {
    const topThree = products
      .filter((product) => product.category === category)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 3);

    bestSellers.push(...topThree);
  });

  return bestSellers;
}