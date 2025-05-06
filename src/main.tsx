
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import App from './App.tsx'
import './index.css'

// Get the Clerk publishable key from environment variables or localStorage
const savedKey = localStorage.getItem('clerk_key');
const envKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
const initialKey = savedKey || envKey || "";

// Component to input Clerk API key
const ClerkKeyInput = () => {
  const [key, setKey] = useState(initialKey);
  const [saved, setSaved] = useState(!!initialKey);

  const handleSave = () => {
    localStorage.setItem('clerk_key', key);
    setSaved(true);
    window.location.reload();
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-800">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Enter Clerk API Key</h1>
        <p className="mb-4">
          Please enter your Clerk publishable key to enable authentication features.
        </p>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Publishable Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. pk_test_..."
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Key
        </button>
        <div className="mt-4 text-sm text-gray-500">
          <p>This will save your key to the browser's localStorage for development purposes.</p>
          <p className="mt-2">For production, use environment variables instead.</p>
        </div>
      </div>
    </div>
  );
};

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

// Render the app or the input component
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  const clerkKey = localStorage.getItem('clerk_key') || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
  
  if (clerkKey && clerkKey !== "your_clerk_publishable_key" && clerkKey.startsWith('pk_')) {
    root.render(
      <ClerkProvider publishableKey={clerkKey}>
        <App />
      </ClerkProvider>
    );
  } else {
    root.render(<ClerkKeyInput />);
  }
}
