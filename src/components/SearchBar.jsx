export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Cari menu..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-96 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
    />
  );
}