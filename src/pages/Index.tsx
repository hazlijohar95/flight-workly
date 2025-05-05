
import React from 'react';
import SearchBar from '../components/SearchBar';
import ProfileBubble from '../components/ProfileBubble';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-3 text-sm">
        Be an early adopter. Help change how people get hired and work gets done — fast.
      </div>

      {/* Header */}
      <header className="container mx-auto pt-6 pb-4 px-6">
        <div className="text-left">
          <h1 className="font-bold text-xl">
            <span className="font-normal">FLIGHT</span>WORKLY
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative pt-8 pb-20">
        {/* Profile Images with Connecting Path */}
        <div className="relative h-[70vh]">
          {/* SVG for dashed path - updated to match the reference image */}
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M200,250 C300,150 400,200 550,150 S750,250 900,200 S1050,300 1150,500 C1100,650 950,700 800,650 S500,700 350,600 S250,450 300,350" 
                  className="dotted-path" />
            
            {/* Adding small dots at key points along the path */}
            <circle cx="400" cy="200" r="4" fill="black" />
            <circle cx="750" cy="250" r="4" fill="black" />
            <circle cx="900" cy="500" r="4" fill="black" />
            <circle cx="550" cy="650" r="4" fill="black" />
            <circle cx="300" cy="350" r="4" fill="black" />
          </svg>

          {/* Profile bubbles - positioned to better match the reference image */}
          <ProfileBubble 
            image="/lovable-uploads/b89a7188-4aea-414b-bdb3-032be4dee871.png"
            message="I just hired 3 bookkeepers in 3 hours!"
            position={{ top: "20%", right: "15%" }}
            size="md"
            messageColor="blue"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/1a6757c6-c20c-4f80-bf34-4d028160d6c8.png"
            message="I need freelancer videographer for 2 days"
            position={{ top: "10%", left: "45%" }}
            size="md"
            messageColor="yellow"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/6c8afcf7-37e4-4e23-8fe6-9198336e06bd.png"
            message="Any Live talent available tonight?"
            position={{ top: "30%", left: "20%" }}
            size="md"
            messageColor="blue"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/ae92b703-ef2a-43e6-acf5-9b1bf236731b.png"
            message="I can't believe how easy to get a job here"
            position={{ bottom: "20%", left: "15%" }}
            size="md"
            messageColor="pink"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/84689890-f8e1-4057-a177-01329c0daed1.png"
            message="Got an expert jump in to help me for some work"
            position={{ bottom: "15%", right: "30%" }}
            size="md"
            messageColor="green"
          />
          
          {/* Blurred profile images */}
          <ProfileBubble 
            image="/lovable-uploads/7974a8f3-eafe-4a53-9f87-454268c85953.png"
            position={{ top: "25%", right: "35%" }}
            size="sm"
            isBlurred={true}
          />
          
          <ProfileBubble 
            image="/lovable-uploads/fb6b2b87-4f6a-467e-ac15-e4751120082c.png"
            position={{ bottom: "30%", right: "15%" }}
            size="sm"
            isBlurred={true}
          />
          
          <ProfileBubble 
            image="/lovable-uploads/350a6f2c-d389-4d7a-8d7a-32a341c540e4.png"
            position={{ bottom: "35%", left: "45%" }}
            size="sm"
            isBlurred={true}
          />
          
          <ProfileBubble 
            image="/lovable-uploads/b9656106-61f1-411d-8d42-57fd9533067f.png"
            position={{ top: "40%", left: "35%" }}
            size="sm"
            isBlurred={true}
          />
          
          <ProfileBubble 
            image="/lovable-uploads/f877774b-dad1-499f-a2df-913c11800742.png"
            position={{ bottom: "25%", left: "35%" }}
            size="sm"
            isBlurred={true}
          />
          
          {/* Central content */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-3xl px-4">
            <h1 className="mb-6 text-5xl md:text-6xl font-bold">
              <span>Hiring </span>
              <span className="italic font-normal">shouldn't </span>
              <span>feel like begging.</span>
            </h1>
            
            <p className="mb-10 text-xl text-gray-700">
              Post what you need. Let skilled freelancers fight to earn it.
            </p>
            
            <SearchBar placeholder="I need a landing page for my business by tomorrow. Anyone?" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
