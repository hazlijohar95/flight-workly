
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Get the Clerk publishable key from environment variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

// Create a placeholder component to show when there's no valid Clerk key
const ClerkKeyMissing = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-800">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Clerk API Key Missing</h1>
        <p className="mb-4">
          To use the Clerk authentication features, you need to provide a valid publishable key.
        </p>
        <ol className="list-decimal pl-5 mb-6 space-y-2">
          <li>Sign up for a free account at <a href="https://clerk.com" className="text-blue-600 underline">clerk.com</a></li>
          <li>Create a new application in the Clerk dashboard</li>
          <li>Go to API Keys in your Clerk dashboard</li>
          <li>Copy your Publishable Key</li>
          <li>Create a <code className="bg-gray-100 p-1 rounded">.env</code> file in your project root</li>
          <li>Add <code className="bg-gray-100 p-1 rounded">VITE_CLERK_PUBLISHABLE_KEY=your_key_here</code></li>
          <li>Restart your development server</li>
        </ol>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-700">
            Note: For security, never commit your actual Clerk key to your repository.
          </p>
        </div>
      </div>
    </div>
  );
};

// Render the app or the missing key component
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);

  // Only render the ClerkProvider if we have a valid key
  if (CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY !== "your_clerk_publishable_key") {
    root.render(
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    );
  } else {
    root.render(<ClerkKeyMissing />);
  }
}
