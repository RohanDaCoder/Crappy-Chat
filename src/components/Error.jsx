import React from 'react';
import { useLocation } from 'react-router-dom';

function Error() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const errorTitle = params.get('title') || 'Something Went Wrong';
  const errorMessage = params.get('message') || 'An Error Occurred.';

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-4">{errorTitle}</h1>
      <p className="text-lg text-gray-700">{errorMessage}</p>
      <br />
      <a id="back" href="/index.html" className="text-blue-500">
        Go Back
      </a>
    </div>
  );
}

export default Error;