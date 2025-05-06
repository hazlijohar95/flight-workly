
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ProfileBubble from '../components/ProfileBubble';
import Footer from '../components/Footer';
import Header from '../components/Header';
import OrbitPath from '../components/OrbitPath';
import { useResponsive } from '../hooks/use-responsive';
import { stylePresets } from '../theme/colors';
import { mainProfileBubbles, mobileProfileBubbles, backgroundBubbles } from '../data/profileBubbles';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isMobile, isDesktop } = useResponsive();
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const handleJoinWaitlist = () => {
    navigate('/waitlist');
  };
  
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Header showEarlyAdopter={true} />

      {/* Main Content */}
      <main className="container mx-auto px-4 relative pt-4">
        {/* Profile Images with Connecting Path */}
        <div className="relative h-[80vh]">
          {/* SVG Path */}
          <OrbitPath isLoaded={isLoaded} />

          {/* Blurred background profile bubbles - desktop only */}
          {isDesktop && backgroundBubbles.map(bubble => (
            <ProfileBubble
              key={bubble.id}
              id={bubble.id} 
              image={bubble.image}
              position={bubble.position}
              size={bubble.size}
              isBlurred={bubble.isBlurred}
              delay={bubble.delay}
            />
          ))}

          {/* Display profile bubbles based on screen size */}
          {isMobile 
            ? mobileProfileBubbles.map(bubble => (
                <ProfileBubble
                  key={bubble.id}
                  id={bubble.id}
                  image={bubble.image}
                  message={bubble.message}
                  position={bubble.position}
                  size={bubble.size}
                  messageColor={bubble.messageColor}
                  delay={bubble.delay}
                  skill={bubble.skill}
                />
              ))
            : mainProfileBubbles.map(bubble => (
                <ProfileBubble
                  key={bubble.id}
                  id={bubble.id}
                  image={bubble.image}
                  message={bubble.message}
                  position={bubble.position}
                  size={bubble.size}
                  messageColor={bubble.messageColor}
                  delay={bubble.delay}
                  skill={bubble.skill}
                />
              ))
          }
          
          {/* Central content */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-3xl px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-20`}>
            <div className={`p-4 md:p-8 rounded-2xl shadow-sm ${stylePresets.glassBg}`}>
              <h1 className="mb-2 md:mb-3 text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
                <span className="block md:inline">Hiring </span>
                <span className="italic font-normal text-[#FF4081] block md:inline">shouldn't </span>
                <span className="block md:inline">feel like begging.</span>
              </h1>
              
              <p className="mb-3 md:mb-4 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                Post what you need. Let skilled freelancers fight to earn it.
              </p>
              
              <div className="mt-4 md:mt-6 flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-medium text-gray-800 py-6 md:py-8">
                  What do you need done?
                </h2>
                
                <Button 
                  onClick={handleJoinWaitlist}
                  className="bg-[#121212] hover:bg-black hover:shadow-md text-white font-medium px-8 py-2 rounded-md text-lg transition-colors"
                >
                  Join the Waitlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
