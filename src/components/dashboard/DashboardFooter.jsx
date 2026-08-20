export const DashboardFooter = () => {
  return (
    <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
      <span>MobiMarket Enterprise Control Panel v1.0</span>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Gateway Online
        </span>
      </div>
    </footer>
  );
};

export default DashboardFooter;
