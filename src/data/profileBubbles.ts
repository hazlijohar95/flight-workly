
export interface ProfileBubbleData {
  id: string;
  image: string;
  message?: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size: "sm" | "md" | "lg";
  isBlurred?: boolean;
  messageColor?: "blue" | "yellow" | "pink" | "green";
  delay?: number;
  skill?: string;
}

// Main profile bubbles that should be visible on all screen sizes
export const mainProfileBubbles: ProfileBubbleData[] = [
  {
    id: 'financial-consultant',
    image: "/lovable-uploads/b89a7188-4aea-414b-bdb3-032be4dee871.png",
    message: "I just hired 3 bookkeepers in 3 hours!",
    position: { top: "8%", right: "30%" },
    size: "lg",
    messageColor: "blue",
    delay: 300,
    skill: "Financial Consultant"
  },
  {
    id: 'marketing-director',
    image: "/lovable-uploads/1a6757c6-c20c-4f80-bf34-4d028160d6c8.png",
    message: "I need freelancer videographer for 2 days",
    position: { top: "10%", left: "25%" },
    size: "lg",
    messageColor: "yellow",
    delay: 400,
    skill: "Marketing Director"
  },
  {
    id: 'ux-designer',
    image: "/lovable-uploads/ae92b703-ef2a-43e6-acf5-9b1bf236731b.png",
    message: "I can't believe how easy to get a job here",
    position: { bottom: "20%", left: "30%" },
    size: "lg",
    messageColor: "pink",
    delay: 600,
    skill: "UX Designer"
  },
  {
    id: 'developer',
    image: "/lovable-uploads/84689890-f8e1-4057-a177-01329c0daed1.png",
    message: "Got an expert jump in to help me for some work",
    position: { bottom: "15%", right: "25%" },
    size: "lg",
    messageColor: "green",
    delay: 700,
    skill: "Developer"
  },
  {
    id: 'product-manager',
    image: "/lovable-uploads/ef6879c7-9026-404d-baa2-97398f17cb05.png",
    message: "Found amazing technical talent in 24 hours!",
    position: { top: "30%", right: "5%" },
    size: "lg",
    messageColor: "pink",
    delay: 450,
    skill: "Product Manager"
  },
  {
    id: 'tech-ceo',
    image: "/lovable-uploads/c3de960a-882f-443c-b503-eee317ff3dd8.png",
    message: "Built my entire tech team through this platform",
    position: { bottom: "35%", right: "15%" },
    size: "lg",
    messageColor: "blue",
    delay: 550,
    skill: "Tech CEO"
  }
];

// Mobile-specific profile bubble positions
export const mobileProfileBubbles: ProfileBubbleData[] = [
  {
    id: 'financial-consultant-mobile',
    image: "/lovable-uploads/b89a7188-4aea-414b-bdb3-032be4dee871.png",
    message: "I just hired 3 bookkeepers in 3 hours!",
    position: { top: "5%", left: "10%" },
    size: "md",
    messageColor: "blue",
    delay: 300,
    skill: "Financial Consultant"
  },
  {
    id: 'marketing-director-mobile',
    image: "/lovable-uploads/1a6757c6-c20c-4f80-bf34-4d028160d6c8.png",
    message: "I need freelancer videographer for 2 days",
    position: { top: "8%", right: "5%" },
    size: "md",
    messageColor: "yellow",
    delay: 400,
    skill: "Marketing Director"
  },
  {
    id: 'ux-designer-mobile',
    image: "/lovable-uploads/ae92b703-ef2a-43e6-acf5-9b1bf236731b.png",
    message: "I can't believe how easy to get a job here",
    position: { bottom: "25%", left: "5%" },
    size: "md",
    messageColor: "pink",
    delay: 600,
    skill: "UX Designer"
  },
  {
    id: 'developer-mobile',
    image: "/lovable-uploads/84689890-f8e1-4057-a177-01329c0daed1.png",
    message: "Got an expert jump in to help me for some work",
    position: { bottom: "25%", right: "5%" },
    size: "md",
    messageColor: "green",
    delay: 700,
    skill: "Developer"
  }
];

// Background blurred bubbles for desktop only
export const backgroundBubbles: ProfileBubbleData[] = [
  {
    id: 'bg-bubble-1',
    image: "/lovable-uploads/350a6f2c-d389-4d7a-8d7a-32a341c540e4.png",
    position: { top: "15%", right: "15%" },
    size: "md",
    isBlurred: true,
    delay: 100
  },
  {
    id: 'bg-bubble-2',
    image: "/lovable-uploads/fb6b2b87-4f6a-467e-ac15-e4751120082c.png",
    position: { bottom: "25%", left: "20%" },
    size: "md",
    isBlurred: true,
    delay: 150
  },
  {
    id: 'bg-bubble-3',
    image: "/lovable-uploads/7974a8f3-eafe-4a53-9f87-454268c85953.png",
    position: { top: "40%", left: "10%" },
    size: "sm",
    isBlurred: true,
    delay: 200
  }
];
