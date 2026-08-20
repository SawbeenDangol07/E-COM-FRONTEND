export const PageHeadingTitle = ({ title, className = "" }) => {
  return (
    <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 ${className}`}>
      {title}
    </h1>
  );
};

export const PageHeadingWithSubtitle = ({ title, children, badge = null, className = "" }) => {
  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      <div className="flex flex-wrap items-center gap-2.5 mb-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {badge && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs">
            {badge}
          </span>
        )}
      </div>
      {children && <p className="text-sm sm:text-base text-slate-500 max-w-2xl font-light">{children}</p>}
    </div>
  );
};

export default PageHeadingWithSubtitle;
