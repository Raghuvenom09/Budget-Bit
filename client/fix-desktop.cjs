const fs = require("fs");
let code = fs.readFileSync("src/App.jsx", "utf8");

// 1. Remove Mobile Wrapper (Root Component)
code = code.replace(
  /const showBottomNav = page !== "rate" && page !== "restaurant";[\s\S]*/,
  `const showNav = true;

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#FF6B35]/20">
      {showNav && <NavBar active={page} setPage={setPage} />}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full animate-in fade-in duration-500">
        {renderPage()}
      </main>
    </div>
  );
}`
);

// 2. Add NavBar, Remove BottomNav
code = code.replace(
  /function BottomNav[\s\S]*?\/\/ ─── Home Page/m,
  `function NavBar({ active, setPage }) {
  const items = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'upload', icon: <Upload size={20} />, label: 'Upload Bill' },
    { id: 'explore', icon: <Compass size={20} />, label: 'Explore' },
  ];
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
          <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-inner">B</div>
          <span className="font-black text-2xl tracking-tight text-gray-800">Budget<span className="text-[#FF6B35]">Bit</span></span>
        </div>
        <div className="flex items-center gap-2">
          {items.map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)} className={\`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all \${active === item.id ? 'bg-[#FFF0EA] text-[#FF6B35]' : 'text-gray-500 hover:bg-gray-50'}\`}>
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </button>
          ))}
          <button onClick={() => setPage('profile')} className={\`ml-4 pl-4 border-l border-gray-200 flex items-center gap-3 font-bold transition-all text-gray-700 hover:text-[#FF6B35]\`}>
            <div className="w-10 h-10 rounded-full bg-[#FFF0EA] flex items-center justify-center text-[#FF6B35] border border-[#FF6B35]/20"><User size={20} /></div>
            <span className="hidden sm:block">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Home Page`
);

// 3. Grid & Spacing Fixes
code = code.replace(/<div className="pb-24">/g, '<div className="pb-8 w-full">');
code = code.replace(/<div className="pb-24 min-h-screen">/g, '<div className="pb-8 w-full">');
code = code.replace(/<div className="pb-28">/g, '<div className="pb-8 w-full">');

// Hero headers
code = code.replace(/px-5 pt-12 pb-8 rounded-b-3xl/g, 'p-10 rounded-3xl mt-4');
code = code.replace(/px-5 pt-12 pb-6 rounded-b-3xl/g, 'p-10 rounded-3xl mt-4');
code = code.replace(/px-5 pt-12 pb-10 rounded-b-3xl/g, 'p-10 rounded-3xl mt-4');
code = code.replace(/<div className="px-4 mt-5">/g, '<div className="mt-10 px-2">');
code = code.replace(/<div className="px-4">/g, '<div className="px-2">');

// Convert quick stats layout
code = code.replace(/className="grid grid-cols-3 gap-3 mb-6"/g, 'className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"');

// Convert horizontal scrolling lists to standard CSS grids
code = code.replace(/<div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">/, '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">');
code = code.replace(/flex-shrink-0 w-48 bg-white/g, 'w-full bg-white transition hover:-translate-y-1 hover:shadow-lg');

// Feed lists to grids
code = code.replace(/<div className="space-y-3">/g, '<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">');
code = code.replace(/<div className="space-y-4">/g, '<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">');
code = code.replace(/<div className="space-y-5">/g, '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">');
code = code.replace(/<div className="grid grid-cols-2 gap-3 mb-6">/g, '<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">');

// Split Explore Page
code = code.replace(/<div className="bg-white rounded-3xl shadow-\[0_2px_15px_rgba\(0,0,0,0\.03\)\] border border-gray-100 p-5 mb-6">/, '<div className="flex flex-col lg:flex-row gap-8">\n<div className="w-full lg:w-80 flex-shrink-0">\n<div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 p-6 sticky top-24">');
code = code.replace(/<div className="flex items-center justify-between mb-4 px-1">/, '</div>\n</div>\n<div className="flex-1">\n<div className="flex items-center justify-between mb-6 px-1">');

// Make Upload and Rate page forms slightly narrower on desktop
code = code.replace(/<div className="pb-8 w-full">/g, '<div className="pb-8 w-full max-w-5xl mx-auto">');

// Search bar width
code = code.replace(/<div className="relative">/, '<div className="relative w-full max-w-xl">');


// Add closing div for Explore split
const profileMatchIndex = code.indexOf("// ─── Profile Page");
if(profileMatchIndex !== -1) {
    code = code.slice(0, profileMatchIndex) + "</div>\n\n" + code.slice(profileMatchIndex);
}

fs.writeFileSync("src/App.jsx", code);
console.log("Website mode fully engaged.");

