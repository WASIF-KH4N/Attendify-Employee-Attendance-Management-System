// src/components/ui/Checkbox.jsx
const Checkbox = ({ label, checked, onChange, name }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-blue-600 border-slate-300 rounded focus:ring-blue-200"
      />
      <span className="text-sm text-slate-600">{label}</span>
    </label>
  );
};

export default Checkbox;