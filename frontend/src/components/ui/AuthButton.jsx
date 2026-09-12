const AuthButton = ({ children, loading = false, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-2xl text-[15px] transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;
