const categories = ["All", "Coffee", "Non Coffee", "Pastry"];

export default function CategoryFilter({ active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-5 py-2 rounded-full transition ${
            active === category
              ? "bg-amber-700 text-white"
              : "bg-stone-200 hover:bg-stone-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}