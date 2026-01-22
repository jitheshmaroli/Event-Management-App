import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, DollarSign, Users, Music, Camera, Utensils } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.2)_0%,transparent_50%)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Book Perfect Services <br />
            <span className="text-indigo-300">for Your Dream Events</span>
          </h1>

          <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Find and book the best venues, caterers, photographers, DJs and more — all in one place
          </p>

          {/* Quick Search Teaser */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
                <select className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none">
                  <option value="">Location</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Bangalore</option>
                  <option>Pune</option>
                </select>
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button className="bg-white text-indigo-900 font-bold py-4 px-8 rounded-xl hover:bg-indigo-100 transition transform hover:-translate-y-1 shadow-lg">
                Search Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Service Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from a wide range of trusted service providers for your events
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Utensils, title: "Caterers", color: "bg-emerald-100 text-emerald-700" },
              { icon: Camera, title: "Photographers", color: "bg-blue-100 text-blue-700" },
              { icon: Music, title: "DJs & Music", color: "bg-purple-100 text-purple-700" },
              { icon: Users, title: "Marriage Venues", color: "bg-pink-100 text-pink-700" },
              { icon: Calendar, title: "Hotels & Resorts", color: "bg-amber-100 text-amber-700" },
              { icon: DollarSign, title: "Decorators", color: "bg-cyan-100 text-cyan-700" },
              { icon: Users, title: "Makeup Artists", color: "bg-rose-100 text-rose-700" },
              { icon: Calendar, title: "Event Planners", color: "bg-indigo-100 text-indigo-700" },
            ].map((category, index) => (
              <Link
                key={index}
                to="/services"
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className={`h-28 ${category.color} flex items-center justify-center`}>
                  <category.icon size={48} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {category.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-lg"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust / Stats section (optional bonus look) */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Event Makers Across India
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5,000+", label: "Happy Customers" },
              { number: "350+", label: "Service Providers" },
              { number: "12,000+", label: "Bookings Completed" },
              { number: "25+", label: "Cities Covered" },
            ].map((stat, index) => (
              <div key={index} className="p-8 bg-white rounded-2xl shadow-md">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}