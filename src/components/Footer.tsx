
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Linkedin, Twitter, Mail } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-white pt-8 md:pt-12 pb-6 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
          {/* Logo and tagline */}
          <div className="mb-6 md:mb-0">
            <h3 className="font-bold text-xl">
              <span className="font-normal">FLIGHT</span>WORKLY
            </h3>
            <p className="text-sm text-gray-600 mt-1">Fast Freelance Hiring</p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center space-x-5">
            <a href="https://facebook.com" aria-label="Facebook" className="social-icon">
              <Facebook size={isMobile ? 18 : 20} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="social-icon">
              <Twitter size={isMobile ? 18 : 20} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="social-icon">
              <Instagram size={isMobile ? 18 : 20} />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="social-icon">
              <Linkedin size={isMobile ? 18 : 20} />
            </a>
            <a href="mailto:info@flightworkly.com" aria-label="Email" className="social-icon">
              <Mail size={isMobile ? 18 : 20} />
            </a>
          </div>
        </div>
        
        <Separator className="my-4 md:my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 md:gap-x-6 gap-y-2 mb-6 md:mb-0">
            <Link to="/terms" className="text-xs md:text-sm text-gray-600 hover:text-[#FF4081] transition-colors">Terms</Link>
            <Link to="/privacy" className="text-xs md:text-sm text-gray-600 hover:text-[#FF4081] transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-xs md:text-sm text-gray-600 hover:text-[#FF4081] transition-colors">Cookies</Link>
            <Link to="/about" className="text-xs md:text-sm text-gray-600 hover:text-[#FF4081] transition-colors">About Us</Link>
            <Link to="/contact" className="text-xs md:text-sm text-gray-600 hover:text-[#FF4081] transition-colors">Contact</Link>
          </div>
          
          {/* CTA Button */}
          <Button className="bg-[#121212] hover:bg-black transition-colors text-sm">
            Get Started
          </Button>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 md:mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FlightWorkly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
