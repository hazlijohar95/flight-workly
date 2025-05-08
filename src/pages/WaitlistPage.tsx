
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WaitlistPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page since we're no longer using waitlist
    navigate('/auth/login');
  }, [navigate]);

  return null; // No UI needed as we're redirecting
};

export default WaitlistPage;
