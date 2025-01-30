import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';
export function MyMeeting() {
  const { meeting } = useDyteMeeting();

  return (
    <div style={{ height: '684px' }}>
      <DyteMeeting mode="fill" meeting={meeting} />
    </div>
  );
}