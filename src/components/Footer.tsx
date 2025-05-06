
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="font-bold text-xl">
              <span className="font-normal">FLIGHT</span>WORKLY
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Fast Freelance Hiring. Connecting skilled professionals with clients in need of quality work.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-medium text-gray-800 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-[#FF4081] transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-[#FF4081] transition-colors">How It Works</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-[#FF4081] transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-[#FF4081] transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h4 className="font-medium text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-600 hover:text-[#FF4081] transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-[#FF4081] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-[#FF4081] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="font-medium text-gray-800 mb-4">Join Our Network</h4>
            <p className="text-sm text-gray-600 mb-4">Be the first to know about new features and updates.</p>
            <Button className="bg-[#4CAF50] hover:bg-[#3d9040] transition-colors w-full">
              Get Started Now
            </Button>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-4 mt-6">
              <a href="https://facebook.com" aria-label="Facebook" className="text-gray-500 hover:text-[#FF4081] transition-transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-gray-500 hover:text-[#FF4081] transition-transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="text-gray-500 hover:text-[#FF4081] transition-transform hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-500 hover:text-[#FF4081] transition-transform hover:scale-110">
                <Linkedin size={20} />
              </a>
              <a href="mailto:info@flightworkly.com" aria-label="Email" className="text-gray-500 hover:text-[#FF4081] transition-transform hover:scale-110">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-100 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FlightWorkly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
