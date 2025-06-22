import React from 'react';
import axios from 'axios';

interface ActivityPatcherProps {
  mode: 'single' | 'batch';
  activityId?: string;
  field?: string;
  value?: any;
  batchData?: Array<{
    activityId: string;
    field: string;
    value: any;
  }>;
}

const ActivityPatcher: React.FC<ActivityPatcherProps> = ({
  mode,
  activityId,
  field,
  value,
  batchData = [],
}) => {
  const handleSinglePatch = async () => {
    if (!activityId || !field || value === undefined) {
      console.error('Missing required props for single patch mode');
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:8000/activities/${activityId}`, {
        field,
        value,
      });
      console.log('Patch successful:', response.data);
    } catch (error) {
      console.error('Error patching activity:', error);
    }
  };

  const handleBatchPatch = async () => {
    if (!batchData.length) {
      console.error('No batch data provided');
      return;
    }

    try {
      // Process each item in the batch
      const promises = batchData.map(({ activityId, field, value }) =>
        axios.patch(`http://localhost:8000/activities/${activityId}`, {
          field,
          value,
        })
      );

      const results = await Promise.all(promises);
      console.log('Batch patch successful:', results);
    } catch (error) {
      console.error('Error in batch patch:', error);
    }
  };

  return (
    <div>
      {mode === 'single' ? (
        <button onClick={handleSinglePatch}>Patch Single Activity</button>
      ) : (
        <button onClick={handleBatchPatch}>Patch Batch Activities</button>
      )}
    </div>
  );
};

export default ActivityPatcher; 