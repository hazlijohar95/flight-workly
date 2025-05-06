
import React, { useState } from 'react';
import { Waitlist } from '@clerk/clerk-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import BackgroundCanvas from '../components/BackgroundCanvas';

const WaitlistPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundCanvas />
      <Header showEarlyAdopter={false} />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg">
          <div className="text-center">
            <Logo showTagline={false} className="mx-auto mb-2" linkTo={null} />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Join our waitlist
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Be the first to know when we launch. Help change how people get hired and work gets done — fast.
            </p>
          </div>
          
          <div className="mt-8">
            <Waitlist />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WaitlistPage;
