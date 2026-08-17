export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-stone-900">
        {title}
      </h2>

      <p className="text-stone-500 mt-3 max-w-xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}