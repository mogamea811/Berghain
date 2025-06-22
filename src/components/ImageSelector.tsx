import React, { useState } from 'react';
import axios from 'axios';

type ImageResponse = {
  url: string;
  photographer_name?: string;
  photographer_url?: string;
};

type ImagesResponse = {
  images: ImageResponse[];
};

const ImageScraper: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [unsplashImages, setUnsplashImages] = useState<ImageResponse[]>([]);
  const [wikiImages, setWikiImages] = useState<ImageResponse[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activityId, setActivityId] = useState<string>('');

  const fetchUnsplashImages = async () => {
    try {
      const response = await axios.get<ImagesResponse>(
        `http://localhost:8000/activities/images/?search_term=${searchTerm}`
      );
      setUnsplashImages(response.data.images);
    } catch (err) {
      console.error('Error fetching Unsplash images:', err);
    }
  };

  const fetchWikiImages = async () => {
    try {
      const response = await axios.get<ImageResponse[]>(
        `http://localhost:8000/activities/scrape?search_term=${searchTerm}`
      );
      setWikiImages(response.data);
    } catch (err) {
      console.error('Error fetching Wiki images:', err);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchUnsplashImages(), fetchWikiImages()]);
    } catch (err) {
      setError('Error fetching images.');
    } finally {
      setLoading(false);
    }
  };

  const updateActivityImages = async () => {
    if (!activityId || selectedImages.length === 0) {
      setError('Please provide an activity ID and select at least one image.');
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:8000/activities/${activityId}`, {
        field: 'images',
        value: selectedImages,
      });
      setSelectedImages([])

      if (response.status === 200) {
        alert('Activity images updated successfully!');
      }
    } catch (err) {
      setError('Error updating activity images.');
    }
  };

  const handleSelectImage = (image: ImageResponse) => {
    setSelectedImages((prev) => {
      if (prev.includes(image.url)) {
        return prev.filter((url) => url !== image.url);
      } else {
        return [...prev, image.url];
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchImages();
    }
  };

  return (
    <div>
      <h1>Image Scraper</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a search term (e.g., Eiffel Tower)"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading images...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Unsplash Section */}
      {unsplashImages.length > 0 && (
        <>
          <h2>Unsplash Images</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {unsplashImages.map((image, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <img src={image.url} alt={`Image ${index + 1}`} style={{ width: '200px' }} />
                <br />
                <button
                  onClick={() => handleSelectImage(image)}
                  style={{
                    backgroundColor: selectedImages.includes(image.url) ? 'green' : 'initial',
                    color: selectedImages.includes(image.url) ? 'white' : 'initial',
                  }}
                >
                  {selectedImages.includes(image.url) ? 'Selected' : 'Select'}
                </button>
                {image.photographer_name && (
                  <p>
                    Photographer: {image.photographer_name}
                    <br />
                    <a href={image.photographer_url} target="_blank" rel="noopener noreferrer">
                      Photographer Profile
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Wiki Section */}
      {wikiImages.length > 0 && (
        <>
          <h2>Wikimedia Images</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {wikiImages.map((image, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <img src={image.url} alt={`Wiki Image ${index + 1}`} style={{ width: '200px' }} />
                <br />
                <button
                  onClick={() => handleSelectImage(image)}
                  style={{
                    backgroundColor: selectedImages.includes(image.url) ? 'green' : 'initial',
                    color: selectedImages.includes(image.url) ? 'white' : 'initial',
                  }}
                >
                  {selectedImages.includes(image.url) ? 'Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Selected images preview */}
      {selectedImages.length > 0 && (
        <div>
          <h2>Selected Images</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {selectedImages.map((url, index) => (
              <img key={index} src={url} alt={`Selected ${index}`} style={{ width: '100px' }} />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h2>Update Activity</h2>
        <input
          type="text"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
          placeholder="Enter Activity ID"
        />
        <button onClick={updateActivityImages}>Update Images</button>
      </div>
    </div>
  );
};

export default ImageScraper;
