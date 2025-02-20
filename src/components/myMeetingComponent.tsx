import  { useEffect, useState } from 'react';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';

export const MyMeeting = () => {
  const { meeting } = useDyteMeeting();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (meeting) {
      setIsLoading(false);
    }
  }, [meeting]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[684px] bg-gray-50">
        <div className="text-gray-600">Loading meeting...</div>
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
      <DyteMeeting
        mode="fill"
        meeting={meeting}
        className="w-full h-full"
      />
    </div>
  );
};

export default MyMeeting;