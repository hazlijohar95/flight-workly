
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import ProfileBubble from '../components/ProfileBubble';
import Footer from '../components/Footer';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-xs">
        <span>Be an </span>
        <a href="#" className="underline hover:text-[#FF4081] transition-colors">early adopter</a>
        <span>. Help change how people get hired and work gets done — fast.</span>
      </div>

      {/* Header */}
      <header className="container mx-auto pt-4 pb-2 px-6">
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
          {/* SVG for dashed path - updated to create an orbital path around the center */}
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path 
              d="M200,250 C300,100 500,50 600,150 S800,200 1000,150 S1100,300 1000,450 C900,600 700,650 500,550 S300,500 200,400 S150,300 200,250" 
              className={`dotted-path ${isLoaded ? 'opacity-70' : 'opacity-0'} transition-opacity duration-1000`}
            />
            
            {/* Adding small dots at key points along the path */}
            <circle cx="400" cy="100" r="4" className="path-dot" />
            <circle cx="800" cy="150" r="4" className="path-dot" />
            <circle cx="1000" cy="350" r="4" className="path-dot" />
            <circle cx="600" cy="600" r="4" className="path-dot" />
            <circle cx="250" cy="350" r="4" className="path-dot" />
          </svg>

          {/* Blurred background profile bubbles */}
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

          {/* Sharp profile bubbles - evenly distributed along the path */}
          <ProfileBubble 
            image="/lovable-uploads/b89a7188-4aea-414b-bdb3-032be4dee871.png"
            message="I just hired 3 bookkeepers in 3 hours!"
            position={{ top: "8%", right: "30%" }}
            size="lg"
            messageColor="blue"
            delay={300}
            skill="Financial Consultant"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/1a6757c6-c20c-4f80-bf34-4d028160d6c8.png"
            message="I need freelancer videographer for 2 days"
            position={{ top: "10%", left: "25%" }}
            size="lg"
            messageColor="yellow"
            delay={400}
            skill="Marketing Director"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/ae92b703-ef2a-43e6-acf5-9b1bf236731b.png"
            message="I can't believe how easy to get a job here"
            position={{ bottom: "20%", left: "30%" }}
            size="lg"
            messageColor="pink"
            delay={600}
            skill="UX Designer"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/84689890-f8e1-4057-a177-01329c0daed1.png"
            message="Got an expert jump in to help me for some work"
            position={{ bottom: "15%", right: "25%" }}
            size="lg"
            messageColor="green"
            delay={700}
            skill="Developer"
          />
          
          {/* Central content */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-3xl px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-20`}>
            <div className="bg-white/40 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/30">
              <h1 className="mb-3 text-4xl md:text-6xl font-bold">
                <span className="block md:inline">Hiring </span>
                <span className="italic font-normal text-[#FF4081] block md:inline">shouldn't </span>
                <span className="block md:inline">feel like begging.</span>
              </h1>
              
              <p className="mb-4 text-xl text-gray-700 max-w-2xl mx-auto">
                Post what you need. Let skilled freelancers fight to earn it.
              </p>
              
              <div className="mt-6">
                <SearchBar 
                  placeholder="I need a landing page for my business by tomorrow. Anyone?" 
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
