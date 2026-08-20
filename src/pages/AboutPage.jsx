export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8 text-slate-900">
      {/* Title */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          About the Project
        </h1>
        <p className="text-sm text-slate-500 font-light">
          A dedicated marketplace for buying and selling verified smartphones.
        </p>
      </div>

      {/* Main Content in Clean Paragraph Style */}
      <div className="space-y-6 text-sm sm:text-base text-slate-700 font-light leading-relaxed">
        <p>
          <strong className="text-slate-900 font-bold">MobiMarket</strong> is a full-stack mobile phone e-commerce platform developed by <strong className="text-indigo-600 font-bold">Sabin Dangol</strong>. The project is designed to provide a modern, secure, and user-friendly experience for individuals and merchants to buy, sell, and trade mobile devices with verified IMEI security and escrow trust.
        </p>

        <p>
          The application is built using the <strong className="text-slate-900 font-semibold">MERN stack</strong> (MongoDB, Express.js, React, and Node.js). The frontend is powered by <strong className="text-slate-900 font-semibold">React 19</strong>, styled with <strong className="text-slate-900 font-semibold">Tailwind CSS v4</strong> for a vibrant, responsive interface, and utilizes <strong className="text-slate-900 font-semibold">Redux Toolkit</strong> for global state management. Form handling and robust schema validation are handled through <strong className="text-slate-900 font-semibold">React Hook Form</strong> and <strong className="text-slate-900 font-semibold">Zod</strong>, with seamless toast notifications powered by <strong className="text-slate-900 font-semibold">Sonner</strong>.
        </p>

        <p>
          Core features include direct buyer-to-seller live negotiation messaging, multi-dimensional smartphone filtering (by brand, price range, and category), safe escrow checkout, as well as separate dedicated portals for <strong className="text-indigo-600 font-semibold">Customers</strong>, <strong className="text-indigo-600 font-semibold">Sellers</strong>, and <strong className="text-indigo-600 font-semibold">Administrators</strong>.
        </p>
      </div>
    </div>
  );
}
