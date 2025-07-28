
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Footer from '../components/Footer';
// Removed unused import
import NetworkPattern from '../components/NetworkPattern';
import ProfileBubbleSimple from '../components/ProfileBubbleSimple';
import OrbitPath from '../components/OrbitPath';
import Logo from '../components/Logo';

const LandingPage = (): JSX.Element => {
  const [_isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const handleGetStarted = (): void => {
    navigate('/auth/signup');
  };
  
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 font-['Inter']">
      {/* Background with subtle pink and gray dot patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <NetworkPattern />
        <OrbitPath isLoaded={_isLoaded} />
      </div>

      {/* Floating avatars with network connections */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Orbit path avatars - positioned along the dashed lines */}
        <ProfileBubbleSimple 
          position={{ top: '25%', left: '15%' }}
          size="3rem"
          color="bg-gradient-to-br from-blue-400 to-blue-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/b89a7188-4aea-414b-bdb3-032be4dee871.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '20%', left: '35%' }}
          size="2.8rem"
          color="bg-gradient-to-br from-purple-400 to-purple-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/b9656106-61f1-411d-8d42-57fd9533067f.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '30%', left: '55%' }}
          size="3.2rem"
          color="bg-gradient-to-br from-green-400 to-green-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/c3de960a-882f-443c-b503-eee317ff3dd8.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '45%', left: '70%' }}
          size="2.6rem"
          color="bg-gradient-to-br from-yellow-400 to-yellow-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/ef6879c7-9026-404d-baa2-97398f17cb05.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '65%', left: '75%' }}
          size="3rem"
          color="bg-gradient-to-br from-pink-400 to-pink-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/f877774b-dad1-499f-a2df-913c11800742.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '75%', left: '60%' }}
          size="2.8rem"
          color="bg-gradient-to-br from-indigo-400 to-indigo-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/fb6b2b87-4f6a-467e-ac15-e4751120082c.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '70%', left: '35%' }}
          size="3.2rem"
          color="bg-gradient-to-br from-orange-400 to-orange-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/350a6f2c-d389-4d7a-8d7a-32a341c540e4.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '55%', left: '20%' }}
          size="2.6rem"
          color="bg-gradient-to-br from-teal-400 to-teal-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/6c8afcf7-37e4-4e23-8fe6-9198336e06bd.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '40%', left: '10%' }}
          size="2.8rem"
          color="bg-gradient-to-br from-red-400 to-red-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/7974a8f3-eafe-4a53-9f87-454268c85953.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '15%', left: '25%' }}
          size="3rem"
          color="bg-gradient-to-br from-emerald-400 to-emerald-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/84689890-f8e1-4057-a177-01329c0daed1.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '35%', left: '45%' }}
          size="2.6rem"
          color="bg-gradient-to-br from-violet-400 to-violet-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/ae92b703-ef2a-43e6-acf5-9b1bf236731b.png"
        />
        
        <ProfileBubbleSimple 
          position={{ top: '60%', left: '50%' }}
          size="3.2rem"
          color="bg-gradient-to-br from-cyan-400 to-cyan-600"
          opacity={0.9}
          className="floating-avatar"
          isAvatar={true}
          avatarUrl="/lovable-uploads/1a6757c6-c20c-4f80-bf34-4d028160d6c8.png"
        />
      </div>

      {/* Header with Sign In and Sign Up buttons */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo showTagline={false} variant="dark" />
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/auth/login">
                <Button variant="ghost" className="text-gray-900 hover:text-black hover:bg-gray-100 font-semibold text-base">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button className="bg-black hover:bg-gray-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with frosted glass effect */}
      <main className="relative z-10 flex items-center justify-center min-h-screen py-12">
        {/* Central frosted glass card */}
        <div className="relative z-20 w-full max-w-3xl mx-auto px-4">
          <div className="backdrop-blur-xl bg-white/20 rounded-3xl shadow-2xl border border-white/40 p-12 md:p-20 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-8 leading-tight tracking-tight">
              Hiring <span className="text-[#FF4081] font-medium">shouldn't</span> feel like begging.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Post what you need. Let skilled freelancers fight to earn it.
            </p>
            
            <div className="mb-12">
              <h2 className="text-xl md:text-2xl font-light text-gray-700 mb-8">
                What do you need done?
              </h2>
            </div>
            
            <Button 
              onClick={handleGetStarted}
              className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
