import { lazy, Suspense, useState, useEffect } from 'react';
import { useDyteMeeting } from '@dytesdk/react-web-core';

// Separate loading component
const LoadingView = () => (
  <div className="flex items-center justify-center h-[684px] bg-gray-50">
    <div className="text-gray-600">
      <div className="animate-pulse">Loading meeting components...</div>
    </div>
  </div>
);

// Lazy load with retry mechanism
const loadComponent = () => {
  return import('@dytesdk/react-ui-kit')
    .then(module => ({ default: module.DyteMeeting }))
    .catch(err => {
      console.error('Failed to load DyteMeeting component:', err);
      throw err;
    });
};

const DyteMeeting = lazy(loadComponent);

export const MyMeeting = () => {
  const { meeting } = useDyteMeeting();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Prefetch the component
    const prefetch = async () => {
      try {
        await loadComponent();
      } catch (err) {
        setLoadError(true);
      }
    };
    prefetch();
  }, []);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[684px] bg-gray-50">
        <div className="text-red-600">Failed to load meeting components. Please refresh the page.</div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center h-[684px] bg-gray-50">
        <div className="text-red-600">Failed to initialize meeting</div>
      </div>
    );
  }

  return (
    <div className="relative h-[684px] w-full bg-gray-900">
      <Suspense fallback={<LoadingView />}>
        <DyteMeeting
          mode="fill"
          meeting={meeting}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
};

export default MyMeeting;