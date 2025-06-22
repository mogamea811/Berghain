import React, { useState } from 'react';

const ActivityFinder = () => {
  const [inputId, setInputId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [activityTitle, setActivityTitle] = useState('');

  const handleSubmit = async () => {
    setError('');
    setThumbnails([]);
    setActivityTitle('');
    
    // Use the directly entered ID
    const activityId = inputId.trim();
    
    if (!activityId) {
      setError('Please enter an activity ID.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Load activities from local file
      const response = await fetch('/gyg_berlin_activities.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load activities: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Find the activity that matches the ID
      const activity = data.find(tour => tour.id.toString() === activityId);
      
      if (!activity) {
        setError(`No activity found with ID: ${activityId}`);
        return;
      }
      
      // Extract thumbnail URLs
      const thumbUrls = activity.photos.map(photo => {
        const thumbUrl = photo.urls.find(url => url.size === 'medium');
        return thumbUrl ? thumbUrl.url : null;
      }).filter(url => url !== null);
      
      setActivityTitle(activity.title);
      setThumbnails(thumbUrls);
      
    } catch (err) {
      setError(`Error fetching data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateImages = async () => {
    if (!thumbnails.length) {
      setUpdateMessage('No thumbnails to update. Please find an activity first.');
      return;
    }

    if (!targetId.trim()) {
      setUpdateMessage('Please enter a target ID for the update.');
      return;
    }

    setUpdateLoading(true);
    setUpdateMessage('');
    
    try {
      const response = await fetch(`http://localhost:8000/activities/${targetId.trim()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field: 'images',
          value: thumbnails
        })
      });
      
      if (!response.ok) {
        throw new Error(`Update failed with status: ${response.status}`);
      }
      
      const result = await response.json();
      setUpdateMessage(`Successfully updated images for activity ID: ${targetId}`);
    } catch (err) {
      setUpdateMessage(`Error updating images: ${err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Activity Photo Finder</h1>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Enter activity ID (e.g. 21231)"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button 
            onClick={handleSubmit} 
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Find Photos'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {activityTitle && (
        <h2 className="text-xl font-semibold mb-3">{activityTitle}</h2>
      )}
      
      {thumbnails.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Update Images:</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Enter target ID to update"
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button 
              onClick={handleUpdateImages} 
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              disabled={updateLoading || !thumbnails.length}
            >
              {updateLoading ? 'Updating...' : 'Update Images'}
            </button>
          </div>
          {updateMessage && (
            <div className={`mt-2 p-2 rounded ${updateMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {updateMessage}
            </div>
          )}
        </div>
      )}
      
      {thumbnails.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Thumbnail URLs:</h3>
          <div className="grid grid-cols-1 gap-2 mb-4">
            {thumbnails.map((url, index) => (
              <div key={index} className="border p-2 rounded break-all bg-gray-50">
                {url}
              </div>
            ))}
          </div>
          
          <h3 className="font-medium mb-2">Thumbnail Previews:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {thumbnails.map((url, index) => (
              <div key={`img-${index}`} className="border rounded overflow-hidden">
                <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFinder;