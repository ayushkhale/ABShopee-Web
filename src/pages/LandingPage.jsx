import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaShieldAlt,
  FaChartLine,
  FaBoxOpen,
  FaArrowRight,
  FaTags,
  FaCreditCard,
  FaBolt,
  FaKey,
  FaCheckCircle,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaTruck,
  FaUndo,
  FaSearch,
  FaGift,
  FaUsers,
  FaClock,
  FaLock,
  FaMobileAlt,
  FaHeadset,
  FaRocket,
  FaAward,
  FaChevronRight,
} from "react-icons/fa";
import { apiGet } from "../services/api";
import { FaGooglePlay } from "react-icons/fa";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";

import mobileMockup from "../assets/floatingimages.gif";
import logo from "../assets/logolight.png";
import floatingphones from "../assets/floatingphones.png";
import seller3d from '../assets/seller.png'
import customer from '../assets/customer.webp'


const color = {
  primary: '#0B77A7',
  secondary: '#0057ae',
  background: '#F5F5F5',
  text: '#212121',
};

const UnifiedLandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("sellers");
    const businessId = "da81a423-2230-4586-b47b-07268479cb24";

const [featuredProducts, setFeaturedProducts] = useState([]);
const [productsLoading, setProductsLoading] = useState(true);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  const openPlayStore = () => {
  window.open(
    "https://play.google.com/store/apps/details?id=com.yourapp.package",
    "_blank"
  );
}; 
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await apiGet(
        `/open/business/${businessId}/products`
      );

      if (response.data.success) {
        const products = response.data.data?.rows || [];
        setFeaturedProducts(products.slice(0, 8));
      }
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setProductsLoading(false);
    }
  };

  if (businessId) {
    fetchProducts();
  }
}, [businessId]);

  const sellerFeatures = [
    {
      icon: <FaBoxOpen />,
      title: "Multi-Product Support",
      desc: "Sell physical products, digital goods, license keys, and subscriptions from one unified dashboard.",
    },
    {
      icon: <FaChartLine />,
      title: "Real-Time Analytics",
      desc: "Track orders, revenue, and customer behavior with beautiful charts and actionable insights.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Payments",
      desc: "Razorpay & Stripe integration with automated invoicing, receipts, and instant refunds.",
    },
    {
      icon: <FaTags />,
      title: "Smart Catalog",
      desc: "Organize products with nested categories, custom attributes, and advanced filters.",
    },
    {
      icon: <FaKey />,
      title: "Digital Delivery",
      desc: "Automated license key delivery with bulk CSV upload and inventory management.",
    },
    {
      icon: <FaTruck />,
      title: "Order Fulfillment",
      desc: "Complete order lifecycle management from placement to delivery with tracking.",
    },
  ];

  const customerFeatures = [
    {
      icon: <FaSearch />,
      title: "Smart Discovery",
      desc: "Find exactly what you need with advanced search, filters, and AI-powered recommendations.",
    },
    {
      icon: <FaShoppingCart />,
      title: "Seamless Cart",
      desc: "Add products, apply coupons, and checkout with saved addresses and payment methods.",
    },
    {
      icon: <FaHeart />,
      title: "Wishlist & Alerts",
      desc: "Save favorites and get instant notifications on price drops and restocks.",
    },
    {
      icon: <FaTruck />,
      title: "Live Tracking",
      desc: "Track every order from confirmation to doorstep with real-time status updates.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Safe Checkout",
      desc: "Bank-grade encryption with multiple payment options and buyer protection.",
    },
    {
      icon: <FaUndo />,
      title: "Easy Returns",
      desc: "Hassle-free 7-day returns with instant refunds to your original payment method.",
    },
  ];

  // const stats = [
  //   { value: "15K+", label: "Active Sellers", icon: <FaStore /> },
  //   { value: "₹75Cr+", label: "GMV Processed", icon: <FaChartLine /> },
  //   { value: "2M+", label: "Happy Customers", icon: <FaUsers /> },
  //   { value: "99.9%", label: "Uptime SLA", icon: <FaRocket /> },
  // ];

  // const testimonials = [
  //   {
  //     name: "Rajesh Kumar",
  //     role: "Electronics Seller",
  //     content: "AB SHOPEE transformed my business. From 100 to 5000+ monthly orders in just 6 months. The analytics dashboard is incredible!",
  //     rating: 5,
  //     avatar: "RK",            
  //   },
  //   {
  //     name: "Priya Sharma",
  //     role: "Fashion Boutique",
  //     content: "Finally, a platform that truly understands both physical and digital products. The inventory management is seamless.",
  //     rating: 5,
  //     avatar: "PS",
  //   },
  //   {
  //     name: "Amit Patel",
  //     role: "Regular Customer",
  //     content: "Best online shopping experience! Lightning-fast delivery, easy returns, and the wishlist feature keeps me updated on deals.",
  //     rating: 5,
  //     avatar: "AP",
  //   },
  //   {
  //     name: "Sneha Reddy",
  //     role: "Online Shopper",
  //     content: "Love the order tracking and secure payments. AB SHOPEE has become my go-to platform for everything!",
  //     rating: 5,
  //     avatar: "SR",
  //   },
  // ];

  const whyChooseUs = [
    {
      icon: <FaRocket />,
      title: "Lightning Fast",
      desc: "Optimized for speed with instant page loads and real-time updates.",
    },
    {
      icon: <FaLock />,
      title: "Bank-Grade Security",
      desc: "SSL encryption, secure payments, and data protection at every step.",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      desc: "Dedicated support team always ready to help via chat, email, and phone.",
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile Ready",
      desc: "Fully responsive design that works perfectly on all devices.",
    },
    {
      icon: <FaAward />,
      title: "Trusted Platform",
      desc: "Verified by 15,000+ sellers and loved by 2M+ customers.",
    },
    {
      icon: <FaGift />,
      title: "Best Deals",
      desc: "Exclusive offers, cashback, and rewards for loyal customers.",
    },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="min-h-screen bg-white overflow-x-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <style>{`
        @keyframes floatUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .reveal { 
          opacity: 0; 
          transform: translateY(20px); 
          transition: all 700ms cubic-bezier(.2,.9,.2,1); 
        }
        .reveal.is-visible { 
          opacity: 1; 
          transform: translateY(0); 
          animation: floatUp 600ms ease-out; 
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0B77A7] shadow-md" : "bg-[#0B77A7]"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="AB SHOPEE" className="w-16 h-auto" />
          </div>

          <div className="hidden md:flex cursor-pointer items-center gap-8 text-sm font-semibold text-white">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:scale-105 transition-transform hover:text-gray-200"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hover:scale-105 cursor-pointer transition-transform hover:text-gray-200"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:scale-105 cursor-pointer transition-transform hover:text-gray-200"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="hover:scale-105 cursor-pointer transition-transform hover:text-gray-200"
            >
              Reviews
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block text-sm font-bold px-6 py-3 cursor-pointer rounded-2xl text-white hover:bg-white/20 transition-all"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/register")}
              className="text-sm font-bold text-[#0B77A7] cursor-pointer bg-white px-6 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        className="relative min-h-screen flex items-center pt-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-20">

          <div className="text-gray-900">

            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#0B77A7] px-4 py-2 rounded-full text-xs font-bold mb-6">
              <FaBolt className="text-[#0B77A7]" />
              India's Fastest Growing Marketplace
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
              Sell Smarter,<br />
              <span className="text-[#0B77A7]">Shop Better</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              The all-in-one platform for sellers and customers. Manage your store or shop with confidence — physical products, digital assets, and everything in between.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
     <button
                onClick={() => navigate("/register")}
                className="group flex items-center cursor-pointer justify-center gap-3 bg-[#0B77A7] text-white px-8 py-4 rounded-2xl text-base font-black hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Start Selling Free
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
  onClick={openPlayStore}
  className="group flex items-center justify-center gap-3 cursor-pointer bg-black text-white px-8 py-4 rounded-2xl text-base font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
>
  <FaGooglePlay className="text-2xl" />
  Download on Play Store
</button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              {[
                "No credit card required",
                "Free forever plan",
                "Setup in 2 minutes",
              ].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#0B77A7]" /> {t}
                </span>
              ))}
            </div>
          </div>
          <img src={floatingphones} alt="" className="w-[450px] max-w-4xl mx-auto"  />

        </div>
      </section>

{/* FEATURED PRODUCTS */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">

    <div className="text-center mb-14">
      <h3 className="text-4xl font-black mb-4" style={{ color: color.text }}>
        Trending <span style={{ color: color.primary }}>Products</span>
      </h3>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Discover top picks from our growing marketplace
      </p>
    </div>

    {productsLoading ? (
      <div className="text-center py-20 text-gray-500">
        Loading products...
      </div>
    ) : (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">


        {featuredProducts.map((product) => {
  const image = product.media?.[0]?.url;
  const finalPrice = product.discountPricing?.finalPrice;
  const basePrice = product.discountPricing?.basePrice;

  return (
    <div
      key={product.id}
onClick={openPlayStore}
      className="group cursor-pointer bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-transparent hover:border-blue-200"
    >
      <div className="overflow-hidden">
        <img
          src={image || "/placeholder.png"}
          alt={product.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5">
        <h4 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">
          {product.title}
        </h4>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-3">
          <span
            className="text-xl font-black"
            style={{ color: color.primary }}
          >
            ₹{finalPrice}
          </span>

          {basePrice && basePrice !== finalPrice && (
            <span className="text-sm line-through text-gray-400">
              ₹{basePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
})}

      </div>
    )}

    <div className="text-center mt-14">
   <button
  onClick={openPlayStore}
  className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg inline-flex items-center gap-3"
>
  <FaGooglePlay className="text-xl" />
  Download App to Browse All Products
</button>
    </div>

  </div>
</section>
      {/* STATS */}
      {/* <section className="py-20" style={{ backgroundColor: color.background }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl hover:scale-105 transition-all">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl" style={{ backgroundColor: color.primary }}>
                  {s.icon}
                </div>
                <div className="text-4xl font-black mb-2" style={{ color: color.primary }}>
                  {s.value}
                </div>
                <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ABOUT */}
      <section id="about" className="py-20 bg-white reveal">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-black mb-4" style={{ color: color.text }}>
            Built for <span style={{ color: color.primary }}>Everyone</span>
          </h3>

          <div className="w-20 h-1 rounded-full mx-auto mb-8" style={{ backgroundColor: color.primary }}></div>

          <p className="text-lg text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto">
            Whether you're a seller growing your business or a customer seeking the best deals, AB SHOPEE provides a seamless, secure, and transparent experience.
          </p>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all border-2" style={{ borderColor: color.primary }}>
              <div className="flex justify-center">
                <img src={seller3d} alt="" className="w-52 self-center" />
              </div>
                <h4 className="font-bold text-2xl mb-3" style={{ color: color.primary }}>
                  For Sellers
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Publish products, manage inventory, track orders, and grow your business with powerful analytics and secure payment integrations.
                </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all border-2" style={{ borderColor: color.primary }}>
                             <div className="flex justify-center">
                <img src={customer} alt="" className="w-52 self-center" />                
                </div>
              <h4 className="font-bold text-2xl mb-3" style={{ color: color.secondary }}>
                For Customers
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Browse products, manage wishlist, track orders in real-time, and enjoy secure checkout with easy returns and instant refunds.
              </p>
            </div>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

  {/* SELLER CARD */}
  <div
    className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border-2 flex flex-col items-center text-center"
    style={{ borderColor: color.primary }}
  >
    <div className="flex justify-center mb-6">
      <img
        src={seller3d}
        alt="Seller"
        className="w-56 object-contain"
      />
    </div>

    <h4
      className="font-black text-2xl mb-4"
      style={{ color: color.primary }}
    >
      For Sellers
    </h4>

    <p className="text-gray-600 leading-relaxed max-w-md">
      Publish products, manage inventory, track orders, and grow your business
      with powerful analytics and secure payment integrations.
    </p>
  </div>

  {/* CUSTOMER CARD */}
  <div
    className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border-2 flex flex-col items-center text-center"
    style={{ borderColor: color.secondary }}
  >
    <div className="flex justify-center mb-6">
      <img
        src={customer}
        alt="Customer"
        className="w-56 object-contain"
      />
    </div>

    <h4
      className="font-black text-2xl mb-4"
      style={{ color: color.secondary }}
    >
      For Customers
    </h4>

    <p className="text-gray-600 leading-relaxed max-w-md">
      Browse products, manage wishlist, track orders in real-time, and enjoy
      secure checkout with easy returns and instant refunds.
    </p>
  </div>

</div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 reveal" style={{ backgroundColor: color.background }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black mb-4" style={{ color: color.text }}>
              Why Choose <span style={{ color: color.primary }}>AB SHOPEE</span>?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best experience for both sellers and customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:scale-105 transition-all">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl mb-4" style={{ backgroundColor: color.primary }}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-lg mb-2" style={{ color: color.text }}>
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE APP SHOWCASE */}
      <section className="py-20 bg-white reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black mb-4" style={{ color: color.text }}>
              Shop <span style={{ color: color.primary }}>Anywhere</span>, Anytime
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage your wishlist, track orders, and shop on the go with our powerful mobile app
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-12">
            <div className="relative">
              <img
                src={mobileMockup}
                alt="Mobile App"
                className="w-64 md:w-80 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg" style={{ backgroundColor: color.primary }}>
                  Wishlist
                </div>
              </div>
            </div>

            <div className="relative mt-12 md:mt-0">
              <img
                src={mobileMockup}
                alt="Mobile App"
                className="w-64 md:w-80 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg" style={{ backgroundColor: color.secondary }}>
                  Orders
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-20">
            {[
              { icon: "❤️", text: "Save Favorites" },
              { icon: "📦", text: "Track Orders" },
              { icon: "🔔", text: "Get Alerts" },
              { icon: "💳", text: "Quick Checkout" }
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2"
                style={{ borderColor: color.primary }}
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="font-bold text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES WITH TABS */}
      <section id="features" className="py-20 reveal" style={{ backgroundColor: color.background }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black mb-4" style={{ color: color.text }}>
              Powerful <span style={{ color: color.primary }}>Features</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to sell or shop with confidence — all in one platform
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full flex p-2 shadow-lg">
              <button
                onClick={() => setActiveTab("sellers")}
                className={`px-8 py-3 rounded-full cursor-pointer font-bold text-base transition-all ${activeTab === "sellers" ? "text-white shadow-lg scale-105" : "text-gray-600"
                  }`}
                style={activeTab === "sellers" ? { backgroundColor: color.primary } : {}}
              >
                For Sellers
              </button>
              <button
                onClick={() => setActiveTab("customers")}
                className={`px-8 py-3 rounded-full cursor-pointer font-bold text-base transition-all ${activeTab === "customers" ? "text-white shadow-lg scale-105" : "text-gray-600"
                  }`}
                style={activeTab === "customers" ? { backgroundColor: color.secondary } : {}}
              >
                For Customers
              </button>
            </div>
          </div>

          <div className="relative min-h-[600px]">
            <div
              className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${activeTab === "sellers"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10 absolute inset-0 pointer-events-none"
                }`}
            >
              {sellerFeatures.map((f, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:scale-105 transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-md" style={{ backgroundColor: color.primary }}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: color.text }}>
                    {f.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>

            <div
              className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${activeTab === "customers"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10 absolute inset-0 pointer-events-none"
                }`}
            >
              {customerFeatures.map((f, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:scale-105 transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-md" style={{ backgroundColor: color.secondary }}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: color.text }}>
                    {f.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black mb-4" style={{ color: color.text }}>
              How It <span style={{ color: color.primary }}>Works</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and designed for success
            </p>
          </div>

          <div className="space-y-16">
            {/* For Sellers */}
            <div>
              <h4 className="text-2xl font-bold mb-8 text-center" style={{ color: color.primary }}>
                For Sellers
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: 1, title: "Register", desc: "Create your seller account in 2 minutes", icon: "📝" },
                  { step: 2, title: "Add Products", desc: "Upload products with images and details", icon: "📦" },
                  { step: 3, title: "Get Orders", desc: "Start receiving orders from customers", icon: "🛒" },
                  { step: 4, title: "Track & Grow", desc: "Monitor sales and scale your business", icon: "📈" },
                ].map((item) => (
                  <div key={item.step} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-center border-2" style={{ borderColor: color.primary }}>
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-3 mx-auto text-white" style={{ backgroundColor: color.primary }}>
                      {item.step}
                    </div>
                    <h4 className="font-bold text-lg mb-2" style={{ color: color.text }}>
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* For Customers */}
            <div>
              <h4 className="text-2xl font-bold mb-8 text-center" style={{ color: color.secondary }}>
                For Customers
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: 1, title: "Browse", desc: "Explore products with smart filters", icon: "🔍" },
                  { step: 2, title: "Add to Cart", desc: "Select items and manage your cart", icon: "🛒" },
                  { step: 3, title: "Checkout", desc: "Secure payment and confirmation", icon: "💳" },
                  { step: 4, title: "Receive", desc: "Get your order and share feedback", icon: "📦" },
                ].map((item) => (
                  <div key={item.step} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-center border-2" style={{ borderColor: color.secondary }}>
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-3 mx-auto text-white" style={{ backgroundColor: color.secondary }}>
                      {item.step}
                    </div>
                    <h4 className="font-bold text-lg mb-2" style={{ color: color.text }}>
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    

      {/* CTA */}
      <section className="py-20 reveal" style={{ backgroundColor: color.primary }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands already using AB SHOPEE to grow their business or shop with confidence. Start your journey today!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="group inline-flex items-center cursor-pointer justify-center gap-3 bg-white px-10 py-4 rounded-2xl text-lg font-black hover:scale-105 active:scale-95 transition-all shadow-2xl"
              style={{ color: color.primary }}
            >
              Start Selling Free
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
  onClick={openPlayStore}
  className="inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-all shadow-2xl"
>
  <FaGooglePlay className="text-2xl" />
  Download on Play Store
</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-white py-12 px-6" style={{ backgroundColor: color.text }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <img src={logo} alt="AB SHOPEE" className="w-16 h-auto mb-4" />
              <p className="text-gray-400 text-sm mb-4">
                India's trusted marketplace for sellers and customers.
              </p>
            </div>

            {[
              { title: "For Sellers", links: ["Dashboard", "Add Products", "Analytics", "Payments"] },
              { title: "For Customers", links: ["Browse", "Track Orders", "Wishlist", "Returns"] },
              { title: "Company", links: ["About", "Contact", "Careers", "Terms"] },
            ].map((col, i) => (
              <div key={i}>
                <h3 className="font-bold mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} AB SHOPEE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedLandingPage;
