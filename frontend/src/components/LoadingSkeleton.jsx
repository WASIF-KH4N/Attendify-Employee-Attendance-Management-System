export const CardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-slate-200 rounded-lg w-24" />
        <div className="h-8 bg-slate-200 rounded-lg w-16" />
      </div>
      <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
    </div>
  </div>
);

export const ListSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
            <div className="h-3 bg-slate-200 rounded-lg w-1/2" />
          </div>
          <div className="h-8 bg-slate-200 rounded-xl w-20" />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="bg-slate-50 px-6 py-4 border-b">
      <div className="flex gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded-lg w-20" />
        ))}
      </div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="px-6 py-4 border-b border-slate-50">
        <div className="flex gap-6 items-center">
          <div className="h-4 bg-slate-200 rounded-lg w-32" />
          <div className="h-4 bg-slate-200 rounded-lg w-24" />
          <div className="h-4 bg-slate-200 rounded-lg w-28" />
          <div className="h-6 bg-slate-200 rounded-xl w-16" />
        </div>
      </div>
    ))}
  </div>
);
