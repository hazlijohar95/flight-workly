
import React from 'react';
import { useWaitlist } from '@clerk/clerk-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { colors } from '../theme/colors';

const WaitlistPage = () => {
  const { status, join, isLoading, error } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    await join({ email });
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showEarlyAdopter={false} />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <Logo showTagline={false} className="mx-auto mb-2" linkTo={null} />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Join our waitlist
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Be the first to know when we launch. Help change how people get hired and work gets done — fast.
            </p>
          </div>
          
          {status === "success" ? (
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800 font-medium">
                Thanks for joining! We'll notify you when we launch.
              </p>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF4081] focus:border-[#FF4081]"
                  placeholder="Email address"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF4081] hover:bg-[#FF4081]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4081]"
                >
                  {isLoading ? "Joining..." : "Join the waitlist"}
                </button>
              </div>
              
              <p className="text-xs text-center text-gray-500">
                We'll notify you when we launch. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WaitlistPage;
