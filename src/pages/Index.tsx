
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import ProfileBubble from '../components/ProfileBubble';
import Footer from '../components/Footer';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-xs md:text-sm">
        <span>Be an </span>
        <a href="#" className="underline hover:text-[#FF4081] transition-colors">early adopter</a>
        <span>. Help change how people get hired and work gets done — fast.</span>
      </div>

      {/* Header */}
      <header className="container mx-auto pt-4 pb-2 px-4 md:px-6">
        <div className="flex flex-col text-left">
          <h1 className="font-bold text-xl">
            <span className="font-normal">FLIGHT</span>WORKLY
          </h1>
          <p className="text-xs text-gray-600 -mt-1">Fast Freelance Hiring</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative pt-4">
        {/* Profile Images with Connecting Path */}
        <div className="relative h-[80vh]">
          {/* SVG for dashed path - responsive adjustments */}
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 1200 800" 
            preserveAspectRatio="none"
            style={{ transform: isMobile ? 'scale(0.8)' : 'none' }}
          >
            <path 
              d="M200,250 C300,100 500,50 600,150 S800,200 1000,150 S1100,300 1000,450 C900,600 700,650 500,550 S300,500 200,400 S150,300 200,250" 
              className={`dotted-path ${isLoaded ? 'opacity-70' : 'opacity-0'} transition-opacity duration-1000`}
            />
            
            {/* Path dots - responsive positioning */}
            <circle cx="400" cy="100" r="4" className="path-dot" />
            <circle cx="800" cy="150" r="4" className="path-dot" />
            <circle cx="1000" cy="350" r="4" className="path-dot" />
            <circle cx="600" cy="600" r="4" className="path-dot" />
            <circle cx="250" cy="350" r="4" className="path-dot" />
          </svg>

          {/* Blurred background profile bubbles - responsive positioning */}
          {!isMobile && (
            <>
              <ProfileBubble 
                image="/lovable-uploads/350a6f2c-d389-4d7a-8d7a-32a341c540e4.png"
                position={{ top: "15%", right: "15%" }}
                size="md"
                isBlurred={true}
                delay={100}
              />
              
              <ProfileBubble 
                image="/lovable-uploads/fb6b2b87-4f6a-467e-ac15-e4751120082c.png"
                position={{ bottom: "25%", left: "20%" }}
                size="md"
                isBlurred={true}
                delay={150}
              />
              
              <ProfileBubble 
                image="/lovable-uploads/7974a8f3-eafe-4a53-9f87-454268c85953.png"
                position={{ top: "40%", left: "10%" }}
                size="sm"
                isBlurred={true}
                delay={200}
              />
            </>
          )}

          {/* Sharp profile bubbles - optimized for mobile */}
          <ProfileBubble 
            image="/lovable-uploads/b89a7188-4aea-414b-bdb3-032be4dee871.png"
            message="I just hired 3 bookkeepers in 3 hours!"
            position={isMobile ? { top: "5%", left: "10%" } : { top: "8%", right: "30%" }}
            size={isMobile ? "md" : "lg"}
            messageColor="blue"
            delay={300}
            skill="Financial Consultant"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/1a6757c6-c20c-4f80-bf34-4d028160d6c8.png"
            message="I need freelancer videographer for 2 days"
            position={isMobile ? { top: "8%", right: "5%" } : { top: "10%", left: "25%" }}
            size={isMobile ? "md" : "lg"}
            messageColor="yellow"
            delay={400}
            skill="Marketing Director"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/ae92b703-ef2a-43e6-acf5-9b1bf236731b.png"
            message="I can't believe how easy to get a job here"
            position={isMobile ? { bottom: "25%", left: "5%" } : { bottom: "20%", left: "30%" }}
            size={isMobile ? "md" : "lg"}
            messageColor="pink"
            delay={600}
            skill="UX Designer"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/84689890-f8e1-4057-a177-01329c0daed1.png"
            message="Got an expert jump in to help me for some work"
            position={isMobile ? { bottom: "25%", right: "5%" } : { bottom: "15%", right: "25%" }}
            size={isMobile ? "md" : "lg"}
            messageColor="green"
            delay={700}
            skill="Developer"
          />
          
          {/* New profile bubbles - responsive positions */}
          {!isMobile && (
            <>
              <ProfileBubble 
                image="/lovable-uploads/ef6879c7-9026-404d-baa2-97398f17cb05.png"
                message="Found amazing technical talent in 24 hours!"
                position={{ top: "30%", right: "5%" }}
                size="lg"
                messageColor="pink"
                delay={450}
                skill="Product Manager"
              />
              
              <ProfileBubble 
                image="/lovable-uploads/c3de960a-882f-443c-b503-eee317ff3dd8.png"
                message="Built my entire tech team through this platform"
                position={{ bottom: "35%", right: "15%" }}
                size="lg"
                messageColor="blue"
                delay={550}
                skill="Tech CEO"
              />
            </>
          )}
          
          {/* Central content - improved responsive styling */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-3xl px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-20`}>
            <div className="bg-white/40 backdrop-blur-sm p-4 md:p-8 rounded-2xl shadow-sm border border-white/30">
              <h1 className="mb-2 md:mb-3 text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
                <span className="block md:inline">Hiring </span>
                <span className="italic font-normal text-[#FF4081] block md:inline">shouldn't </span>
                <span className="block md:inline">feel like begging.</span>
              </h1>
              
              <p className="mb-3 md:mb-4 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                Post what you need. Let skilled freelancers fight to earn it.
              </p>
              
              <div className="mt-4 md:mt-6">
                <SearchBar 
                  placeholder={isMobile ? "What do you need done?" : "I need a landing page for my business by tomorrow. Anyone?"} 
                  label="What do you need done?"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Index;
