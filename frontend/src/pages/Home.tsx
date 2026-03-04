import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  DollarSign,
  Users,
  Music,
  Camera,
  Utensils,
  MapPin,
  Star,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState({
    search: "",
    location: "",
    date: "",
  });

  const handleQuickSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setQuickSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    if (quickSearch.search) params.append("search", quickSearch.search);
    if (quickSearch.location) params.append("location", quickSearch.location);
    if (quickSearch.date) params.append("date", quickSearch.date);
    navigate(`/services?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <section
        className="relative bg-cover bg-center h-[600px] md:h-[700px] flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Book Perfect Services <br />
            <span className="text-indigo-300">for Your Dream Events</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto drop-shadow">
            Find and book the best venues, caterers, photographers, DJs and more
            — all in one place
          </p>

          {/* Quick Search Card */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative md:col-span-2">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300"
                  size={20}
                />
                <input
                  name="search"
                  type="text"
                  placeholder="What service are you looking for?"
                  value={quickSearch.search}
                  onChange={handleQuickSearchChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button
                type="button"
                onClick={handleQuickSearch}
                className="md:col-span-2 bg-white text-indigo-900 font-bold py-4 px-8 rounded-xl hover:bg-indigo-100 transition transform hover:-translate-y-1 shadow-lg"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to make your event unforgettable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Search & Compare",
                description:
                  "Find trusted vendors, compare prices and read reviews.",
                color: "bg-indigo-100 text-indigo-600",
              },
              {
                icon: Calendar,
                title: "Book Instantly",
                description:
                  "Check availability and confirm your booking in minutes.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: CheckCircle,
                title: "Celebrate with Peace",
                description: "Focus on your event while we handle the details.",
                color: "bg-emerald-100 text-emerald-600",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition-shadow"
              >
                <div
                  className={`inline-flex p-4 rounded-full ${step.color} mb-6`}
                >
                  <step.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories with Images */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Service Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from a wide range of trusted service providers for your
              events
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Utensils,
                title: "Caterers",
                value: "catering",
                image:
                  "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                icon: Camera,
                title: "Photographers",
                value: "photography",
                image:
                  "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                icon: Music,
                title: "DJs & Music",
                value: "music",
                image:
                  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                icon: Users,
                title: "Marriage Venues",
                value: "venue",
                image:
                  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                icon: Calendar,
                title: "Hotels & Resorts",
                value: "venue",
                image:
                  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                icon: DollarSign,
                title: "Decorators",
                value: "decoration",
                image:
                  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                icon: Users,
                title: "Makeup Artists",
                value: "makeup",
                image:
                  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                icon: Calendar,
                title: "Event Planners",
                value: "planning",
                image:
                  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&q=80",
              },
            ].map((category, index) => (
              <Link
                key={index}
                to={`/services?category=${category.value}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square"
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <category.icon size={24} className="text-indigo-300" />
                    <h3 className="text-xl font-bold">{category.title}</h3>
                  </div>
                  <p className="text-sm text-gray-200">Explore →</p>
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

      {/* Trust / Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Event Makers Across India
            </h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              Join thousands of happy customers who planned their perfect events
              with us
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5,000+", label: "Happy Customers", icon: Users },
              { number: "350+", label: "Service Providers", icon: CheckCircle },
              {
                number: "12,000+",
                label: "Bookings Completed",
                icon: TrendingUp,
              },
              { number: "25+", label: "Cities Covered", icon: MapPin },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
                  <stat.icon size={32} className="text-indigo-300" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-indigo-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-indigo-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who made their dream events a
              reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Wedding Client",
                content:
                  "Found the perfect wedding photographer through this platform. The booking was seamless and the quality exceeded our expectations!",
                avatar: "https://i.pravatar.cc/150?img=1",
              },
              {
                name: "Rahul Mehta",
                role: "Corporate Event Organizer",
                content:
                  "Great selection of vendors. We booked a caterer and decorator for our annual conference and everything was flawless.",
                avatar: "https://i.pravatar.cc/150?img=2",
              },
              {
                name: "Anjali Desai",
                role: "Birthday Party",
                content:
                  "The DJ we booked was amazing! The whole process was so easy, from searching to payment. Highly recommended.",
                avatar: "https://i.pravatar.cc/150?img=3",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700">"{testimonial.content}"</p>
                <div className="flex items-center gap-1 text-amber-500 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
