import { Phone, MapPin, Mail } from 'lucide-react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#252B42] text-white">
      {/* Desktop Footer */}
      <div className="hidden md:block container mx-auto px-4 py-12">
        <div className="grid grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="font-bold mb-5">Company Info</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/career" className="text-gray-300 hover:text-white">Career</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="/legal" className="text-gray-300 hover:text-white">Legal</a></li>
            </ul>
          </div>

          {/* Features */}
          <div className="col-span-1">
            <h3 className="font-bold mb-5">Features</h3>
            <ul className="space-y-3">
              <li><a href="/marketing" className="text-gray-300 hover:text-white">Business Marketing</a></li>
              <li><a href="/analytics" className="text-gray-300 hover:text-white">User Analytic</a></li>
              <li><a href="/support" className="text-gray-300 hover:text-white">Unlimited Support</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-bold mb-5">Resources</h3>
            <ul className="space-y-3">
              <li><a href="/ios" className="text-gray-300 hover:text-white">IOS & Android</a></li>
              <li><a href="/demo" className="text-gray-300 hover:text-white">Watch a Demo</a></li>
              <li><a href="/customers" className="text-gray-300 hover:text-white">Customers</a></li>
              <li><a href="/api" className="text-gray-300 hover:text-white">API</a></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="col-span-2">
            <h3 className="font-bold mb-5">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone size={20} className="text-gray-300" />
                <span className="text-gray-300">(480) 555-0103</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={20} className="text-gray-300" />
                <span className="text-gray-300">4517 Washington Ave.</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="text-gray-300" />
                <span className="text-gray-300">debra.holt@example.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex justify-between items-center border-t border-gray-700 pt-6">
          <p className="text-sm text-gray-300">Made With Love By Finland All Right Reserved</p>
          <div className="flex gap-4">
            <Facebook className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
            <Instagram className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
            <Youtube className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden px-4 py-8">
        <div className="space-y-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold mb-4">Company Info</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-gray-300">About Us</a></li>
              <li><a href="/career" className="text-gray-300">Career</a></li>
              <li><a href="/blog" className="text-gray-300">Blog</a></li>
              <li><a href="/legal" className="text-gray-300">Legal</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold mb-4">Features</h3>
            <ul className="space-y-3">
              <li><a href="/marketing" className="text-gray-300">Business Marketing</a></li>
              <li><a href="/analytics" className="text-gray-300">User Analytic</a></li>
              <li><a href="/support" className="text-gray-300">Unlimited Support</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="/ios" className="text-gray-300">IOS & Android</a></li>
              <li><a href="/demo" className="text-gray-300">Watch a Demo</a></li>
              <li><a href="/customers" className="text-gray-300">Customers</a></li>
              <li><a href="/api" className="text-gray-300">API</a></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="font-bold mb-4">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone size={20} className="text-gray-300" />
                <span className="text-gray-300">(480) 555-0103</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={20} className="text-gray-300" />
                <span className="text-gray-300">4517 Washington Ave.</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="text-gray-300" />
                <span className="text-gray-300">debra.holt@example.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media & Copyright */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-300">Made With Love By Finland All Right Reserved</p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-gray-300" />
              <Instagram className="w-5 h-5 text-gray-300" />
              <Youtube className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
