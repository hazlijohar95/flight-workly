
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import ProfileBubble from '../components/ProfileBubble';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
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
      <main className="container mx-auto px-4 relative pt-4 pb-20">
        {/* Profile Images with Connecting Path */}
        <div className="relative h-[80vh]">
          {/* SVG for dashed path - updated to match the reference image */}
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path 
              d="M200,250 C300,150 400,200 550,150 S750,250 900,200 S1050,300 1150,500 C1100,650 950,700 800,650 S500,700 350,600 S250,450 300,350" 
              className={`dotted-path ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
            />
            
            {/* Adding small dots at key points along the path */}
            <circle cx="400" cy="200" r="4" className="path-dot" />
            <circle cx="750" cy="250" r="4" className="path-dot" />
            <circle cx="900" cy="500" r="4" className="path-dot" />
            <circle cx="550" cy="650" r="4" className="path-dot" />
            <circle cx="300" cy="350" r="4" className="path-dot" />
          </svg>

          {/* Profile bubbles - positioned to match the reference image with skills */}
          <ProfileBubble 
            image="/lovable-uploads/b89a7188-4aea-414b-bdb3-032be4dee871.png"
            message="I just hired 3 bookkeepers in 3 hours!"
            position={{ top: "15%", right: "15%" }}
            size="lg"
            messageColor="blue"
            delay={200}
            skill="Financial Consultant"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/1a6757c6-c20c-4f80-bf34-4d028160d6c8.png"
            message="I need freelancer videographer for 2 days"
            position={{ top: "8%", left: "40%" }}
            size="lg"
            messageColor="yellow"
            delay={400}
            skill="Marketing Director"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/6c8afcf7-37e4-4e23-8fe6-9198336e06bd.png"
            message="Any Live talent available tonight?"
            position={{ top: "30%", left: "15%" }}
            size="md"
            messageColor="blue"
            delay={300}
            skill="Event Manager"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/ae92b703-ef2a-43e6-acf5-9b1bf236731b.png"
            message="I can't believe how easy to get a job here"
            position={{ bottom: "20%", left: "20%" }}
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
          
          {/* Profile bubble with glasses */}
          <ProfileBubble
            image="/lovable-uploads/f877774b-dad1-499f-a2df-913c11800742.png"
            message="Looking for talented developers in my area"
            position={{ top: "35%", right: "30%" }}
            size="lg"
            messageColor="blue"
            delay={450}
            skill="Project Manager"
          />
          
          {/* Person in black shirt */}
          <ProfileBubble
            image="/lovable-uploads/b9656106-61f1-411d-8d42-57fd9533067f.png"
            message="Just completed my first gig through the platform!"
            position={{ bottom: "30%", right: "10%" }}
            size="lg"
            messageColor="pink"
            delay={550}
            skill="Video Editor"
          />
          
          {/* Removed some blurred profile images to reduce clutter */}
          <ProfileBubble 
            image="/lovable-uploads/7974a8f3-eafe-4a53-9f87-454268c85953.png"
            position={{ top: "25%", right: "35%" }}
            size="sm"
            isBlurred={true}
            delay={500}
            skill="Copywriter"
          />
          
          <ProfileBubble 
            image="/lovable-uploads/350a6f2c-d389-4d7a-8d7a-32a341c540e4.png"
            position={{ bottom: "35%", left: "40%" }}
            size="sm"
            isBlurred={true}
            delay={900}
            skill="Data Analyst"
          />
          
          {/* Central content */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-3xl px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="mb-4 text-5xl md:text-6xl font-bold">
              <span className="block md:inline">Hiring </span>
              <span className="italic font-normal text-[#FF4081] block md:inline">shouldn't </span>
              <span className="block md:inline">feel like begging.</span>
            </h1>
            
            <p className="mb-6 text-xl text-gray-700 max-w-2xl mx-auto">
              Post what you need. Let skilled freelancers fight to earn it.
            </p>
            
            <SearchBar 
              placeholder="I need a landing page for my business by tomorrow. Anyone?" 
              label="What do you need done?"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
