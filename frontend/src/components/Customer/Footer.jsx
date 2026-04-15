import React from 'react';

function Footer() {
  return (
    <footer className="bg-primary-black text-white px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold tracking-tight mb-6">WEAR WEB</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Your one-stop shop for premium fashion and lifestyle products. Designed for the modern explorer.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold mb-6 tracking-wide text-sm uppercase">Shop</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><span className="hover:text-white transition-colors cursor-pointer">Men's Collection</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Women's Collection</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Kids</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">New Arrivals</span></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-semibold mb-6 tracking-wide text-sm uppercase">Support</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><span className="hover:text-white transition-colors cursor-pointer">Help Center & FAQ</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Returns & Exchanges</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Shipping Information</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-6 tracking-wide text-sm uppercase">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
            />
            <button className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Wear Web. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
