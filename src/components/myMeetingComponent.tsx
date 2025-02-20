import { Suspense, lazy } from 'react';

const DyteMeeting = lazy(() => import('@dytesdk/react-ui-kit').then(module => ({ default: module.DyteMeeting })));
import { useDyteMeeting } from '@dytesdk/react-web-core';

export function MyMeeting() {
  const { meeting } = useDyteMeeting();

  return (
    <div style={{ height: '684px' }}>
      <Suspense fallback={<div>Loading meeting...</div>}>
        <DyteMeeting mode="fill" meeting={meeting} />
      </Suspense>
    </div>
  );
}
