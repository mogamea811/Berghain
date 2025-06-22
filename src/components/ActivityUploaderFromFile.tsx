import React, { useState } from 'react';
type TimeWindow = "morning" | "afternoon" | "evening" | "night";

interface Activity {
  destination: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
  rating: number;
  user_ratings_total: number;
  place_id: string;
  category: string;
  subcategory?: string;
  price: number;
  duration: number;
  url: string;
  affiliate_link: string | null;
  opening_hours: {
    [key: string]: { opening_time: string; closing_time: string } | null;
  };
  available_slots: any | null;
  description: string;
  images:any;
  keyword_matched:string;
  timeScores?: Partial<Record<TimeWindow, number>>;
}

const ActivityUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{success: number, failed: number}>({success: 0, failed: 0});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const processActivities = async () => {
    if (!file) {
      setStatus('Please select a JSON file');
      return;
    }

    setIsLoading(true);
    setStatus('Reading file...');
    let successCount = 0;
    let failedCount = 0;

    try {
      // Read the file content
      const fileContent = await file.text();
      const activities = JSON.parse(fileContent);
      console.log(activities)
      if (!Array.isArray(activities)) {
        // If the JSON is not an array, check if it's a single activity object
        if (activities && typeof activities === 'object') {
          await uploadActivity(activities);
          successCount++;
        } else {
          throw new Error('Invalid file format. Expected an array of activities or a single activity object.');
        }
      } else {
        setStatus(`Found ${activities.length} activities. Starting upload...`);
        
        // Process each activity sequentially
        for (let i = 0; i < activities.length; i++) {
          try {
            await uploadActivity(activities[i]);
            successCount++;
            setStatus(`Uploaded ${successCount}/${activities.length} activities...`);
          } catch (error) {
            console.error(`Failed to upload activity ${activities[i].name}:`, error);
            failedCount++;
          }
        }
      }
      
      setStatus(`Upload complete! Successfully uploaded ${successCount} activities. Failed: ${failedCount}`);
      setResults({ success: successCount, failed: failedCount });
    } catch (error) {
      console.error('Error processing file:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadActivity = async (activity: Activity) => {

      
    const response = await fetch('http://127.0.0.1:8000/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      console.log(activity)
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Activities Uploader</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Select JSON file with activities:
        </label>
        <div className="flex flex-col">
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={processActivities}
            disabled={isLoading || !file}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-300"
          >
            {isLoading ? 'Processing...' : 'Upload Activities'}
          </button>
        </div>
      </div>
      
      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-gray-800">{status}</p>
          
          {results.success > 0 && (
            <div className="mt-2">
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Successfully uploaded: {results.success}</span>
              </div>
              
              {results.failed > 0 && (
                <div className="flex items-center text-red-600">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Failed: {results.failed}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Note: The file should contain either a single activity object or an array of activities in JSON format.</p>
      </div>
    </div>
  );
};

export default ActivityUploader;