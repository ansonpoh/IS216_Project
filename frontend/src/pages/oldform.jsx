import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    postalCode: ''
  });
  const [coordinates, setCoordinates] = useState(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Google Maps configuration
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: 51.5074, // Default center (London)
    lng: -0.1278
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Geocode postal code to get coordinates
  const geocodePostalCode = async (postalCode) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: postalCode }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng()
            });
          } else {
            reject(new Error('Geocode was not successful: ' + status));
          }
        });
      });
    } catch (error) {
      throw new Error('Failed to geocode postal code');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Geocode the postal code
      const coords = await geocodePostalCode(formData.postalCode);
      setCoordinates(coords);

      // If you want to save to Supabase, you would call your backend here
      // Example:
      // await saveToSupabase({
      //   title: formData.title,
      //   postalCode: formData.postalCode,
      //   latitude: coords.lat,
      //   longitude: coords.lng
      // });

      console.log('Form data:', {
        ...formData,
        coordinates: coords
      });

    } catch (err) {
      setError('Could not find location for this postal code. Please try again.');
      console.error('Geocoding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Map load callback
  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Location</h1>
      
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location title"
            />
          </div>
          
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter postal code"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Finding Location...' : 'Add Location'}
        </button>
      </form>

      {/* Map Section */}
      <div className="border rounded-lg overflow-hidden">
        <LoadScript
          googleMapsApiKey="YOUR_GOOGLE_API_KEY" // Replace with your actual API key
          libraries={['places']} // Add any additional libraries you need
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={coordinates || center}
            zoom={coordinates ? 15 : 10}
            onLoad={onMapLoad}
          >
            {/* Add marker if coordinates are available */}
            {coordinates && (
              <Marker
                position={coordinates}
                title={formData.title}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Display coordinates when available */}
      {coordinates && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-600">
            Location: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapForm;