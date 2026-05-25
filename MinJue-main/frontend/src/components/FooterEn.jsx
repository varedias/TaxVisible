import React from 'react';
import { Mail, Facebook, Twitter, Linkedin, Globe } from 'lucide-react';

const FooterEn = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">DongShiDi</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your premier global platform for AI vision inspection equipment. We connect international buyers with top-tier manufacturers for leasing, purchasing, and technical consulting.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Globe size={16} />
              <span>Global Shipping Available</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-slate-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-slate-400 transition-colors">Global Partners</a></li>
              <li><a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-slate-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-slate-400 transition-colors">Submit a Ticket</a></li>
              <li><a href="#" className="hover:text-slate-400 transition-colors">Sourcing Request</a></li>
              <li><a href="#" className="hover:text-slate-400 transition-colors">Supplier Verification</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-slate-600 mt-0.5" />
                <div>
                  <span className="block text-white">Email Support</span>
                  <span>2478686497@qq.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-slate-600 mt-0.5" />
                <div>
                  <span className="block text-white">Business Email</span>
                  <span>2696432359@qq.com</span>
                </div>
              </li>
            </ul>
            
            <div className="flex space-x-4 mt-6">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-slate-400 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-slate-800 hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; 2025 DongShiDi Global. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Sitemap</a>
            <a href="#" className="hover:text-slate-300">Cookies</a>
            <a href="#" className="hover:text-slate-300">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterEn;
