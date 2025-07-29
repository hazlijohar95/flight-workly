import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'book';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  children?: React.ReactNode;
}

const defaultSEO = {
  title: 'Flight Workly - Modern Freelancing Platform',
  description: 'Connect with top freelancers and clients on Flight Workly. Post jobs, find work, and manage projects with our secure, modern freelancing platform.',
  keywords: [
    'freelancing',
    'freelance platform',
    'remote work',
    'job posting',
    'freelancer marketplace',
    'project management',
    'secure payments',
    'escrow',
    'milestone payments',
    'web development',
    'design',
    'marketing',
    'writing',
    'translation',
    'virtual assistant'
  ],
  author: 'Flight Workly Team',
  image: '/og-image.png',
  url: 'https://flightworklycom.netlify.app',
  type: 'website' as const,
  twitterCard: 'summary_large_image' as const,
  twitterSite: '@flightworkly',
  twitterCreator: '@flightworkly',
};

export function SEO({
  title,
  description,
  keywords,
  author,
  image,
  url,
  type,
  publishedTime,
  modifiedTime,
  section,
  tags,
  twitterCard,
  twitterSite,
  twitterCreator,
  canonical,
  noindex = false,
  nofollow = false,
  children,
}: SEOProps): JSX.Element {
  const seo = {
    title: title ? `${title} | Flight Workly` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    author: author || defaultSEO.author,
    image: image || defaultSEO.image,
    url: url || defaultSEO.url,
    type: type || defaultSEO.type,
    twitterCard: twitterCard || defaultSEO.twitterCard,
    twitterSite: twitterSite || defaultSEO.twitterSite,
    twitterCreator: twitterCreator || defaultSEO.twitterCreator,
    canonical: canonical || defaultSEO.url,
  };

  const fullImageUrl = seo.image.startsWith('http') 
    ? seo.image 
    : `${defaultSEO.url}${seo.image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <meta name="author" content={seo.author} />
      <meta name="robots" content={noindex ? 'noindex' : nofollow ? 'nofollow' : 'index, follow'} />
      <meta name="googlebot" content={noindex ? 'noindex' : 'index, follow'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seo.canonical} />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:site_name" content="Flight Workly" />
      <meta property="og:locale" content="en_US" />
      
      {/* Open Graph Additional Tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={seo.twitterCard} />
      <meta name="twitter:site" content={seo.twitterSite} />
      <meta name="twitter:creator" content={seo.twitterCreator} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content="Flight Workly - Modern Freelancing Platform" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Flight Workly" />
      
      {/* Security Meta Tags */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Flight Workly",
          "url": "https://flightworklycom.netlify.app",
          "logo": "https://flightworklycom.netlify.app/logo.png",
          "description": "Modern freelancing platform connecting talented freelancers with clients worldwide.",
          "sameAs": [
            "https://twitter.com/flightworkly",
            "https://linkedin.com/company/flightworkly"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@flightworkly.com"
          }
        })}
      </script>
      
      {/* Structured Data - WebSite */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Flight Workly",
          "url": "https://flightworklycom.netlify.app",
          "description": "Modern freelancing platform for connecting freelancers and clients",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://flightworklycom.netlify.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      
      {children}
    </Helmet>
  );
}

// Predefined SEO configurations for different pages
export const pageSEO = {
  home: {
    title: 'Flight Workly - Modern Freelancing Platform',
    description: 'Connect with top freelancers and clients on Flight Workly. Post jobs, find work, and manage projects with our secure, modern freelancing platform.',
    keywords: ['freelancing', 'freelance platform', 'remote work', 'job posting'],
    type: 'website' as const,
  },
  
  jobs: {
    title: 'Browse Jobs - Flight Workly',
    description: 'Find the perfect freelance job on Flight Workly. Browse thousands of opportunities in web development, design, marketing, writing, and more.',
    keywords: ['freelance jobs', 'remote work', 'web development jobs', 'design jobs'],
    type: 'website' as const,
  },
  
  postJob: {
    title: 'Post a Job - Flight Workly',
    description: 'Post your job and find the perfect freelancer on Flight Workly. Get quality work done quickly and securely.',
    keywords: ['post job', 'hire freelancer', 'project posting', 'freelance hiring'],
    type: 'website' as const,
  },
  
  login: {
    title: 'Sign In - Flight Workly',
    description: 'Sign in to your Flight Workly account to access your dashboard, manage projects, and connect with clients.',
    keywords: ['sign in', 'login', 'freelance account', 'dashboard'],
    type: 'website' as const,
  },
  
  signup: {
    title: 'Sign Up - Flight Workly',
    description: 'Join Flight Workly today and start your freelancing journey. Create your profile, find work, and grow your career.',
    keywords: ['sign up', 'register', 'freelance account', 'join platform'],
    type: 'website' as const,
  },
  
  profile: {
    title: 'Profile - Flight Workly',
    description: 'Manage your Flight Workly profile, showcase your skills, and attract more clients.',
    keywords: ['profile', 'freelancer profile', 'portfolio', 'skills'],
    type: 'profile' as const,
  },
  
  dashboard: {
    title: 'Dashboard - Flight Workly',
    description: 'Manage your projects, track payments, and grow your freelancing business on Flight Workly.',
    keywords: ['dashboard', 'project management', 'freelance business', 'payments'],
    type: 'website' as const,
  },
};

// Hook for easy SEO usage in components
export function useSEO(pageType: keyof typeof pageSEO, customProps?: Partial<SEOProps>) {
  return {
    ...pageSEO[pageType],
    ...customProps,
  };
} 