const FormInput = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon: Icon,
  name 
}) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-slate-800 placeholder:text-slate-400 transition-all duration-200 text-[15px]`}
        />
      </div>
    </div>
  );
};

export default FormInput;
