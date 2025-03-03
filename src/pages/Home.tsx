import React from 'react';
import { Gamepad2, Book, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const maps = [
  { name: 'Ascent', image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000' },
  { name: 'Haven', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000' },
  { name: 'Split', image: 'https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000' },
  { name: 'Bind', image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000' },
  { name: 'Icebox', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000' },
  { name: 'Breeze', image: 'https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000' }
];

function Home() {
  return (
    <div className="min-h-screen bg-[#0F1923]">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/20 backdrop-blur-lg rounded-full px-8 py-4 flex items-center gap-8 border border-white/10">
          <Link to="/" className="text-[#ECE8E1] font-medium hover:text-[#FF4655] transition-colors">home</Link>
          <Link to="/maps" className="text-[#ECE8E1] font-medium hover:text-[#FF4655] transition-colors">maps</Link>
          <Link to="/agents" className="text-[#ECE8E1] font-medium hover:text-[#FF4655] transition-colors">agents</Link>
          <Link to="/lineups" className="text-[#ECE8E1] font-medium hover:text-[#FF4655] transition-colors">lineups</Link>
          <button className="bg-[#FF4655]/10 p-2 rounded-full hover:bg-[#FF4655]/20 transition-colors">
            <Search size={20} className="text-[#FF4655]" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png/revision/latest/scale-to-width-down/1000?cb=20200620202335" 
            alt="Haven Map"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#0F1923]" />
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            <Gamepad2 size={40} className="text-[#FF4655] mb-2" />
            <h1 className="logo-text text-7xl md:text-9xl font-bold text-[#ECE8E1] tracking-wider">
              kuvsplaybook
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-[#ECE8E1]/80 mb-8 max-w-2xl mx-auto">
            elevate your game with pro strategies and perfect lineups
          </p>
          <Link to="/playbook" className="valorant-button inline-block">
            <span className="flex items-center gap-2">
              <Book size={20} />
              access playbook
            </span>
          </Link>
        </div>
      </header>

      {/* Maps Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#ECE8E1]">
          Featured Maps
        </h2>
        <p className="text-center text-[#ECE8E1]/60 mb-12">
          Explore detailed strategies for every map in the current rotation
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maps.map((map) => (
            <div key={map.name} className="map-card group cursor-pointer">
              <img 
                src={map.image} 
                alt={map.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-2xl font-bold text-[#ECE8E1]">{map.name}</h3>
                <p className="text-[#ECE8E1]/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  View strategies →
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ECE8E1]/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-[#ECE8E1]/60">
          <p>© 2024 kuvsplaybook. not affiliated with riot games.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;