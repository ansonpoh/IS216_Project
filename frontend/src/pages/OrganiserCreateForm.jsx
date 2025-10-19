import React, { useState, useMemo } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// CRA -> REACT_APP_*  |  Vite -> import.meta.env.VITE_*
const API_KEY = process.env.REACT_APP_MAPS_API_KEY;

export default function MapForm({
  defaultCenter = { lat: 1.3521, lng: 103.8198 }, // SG default; override if you want
  defaultZoom = 11,
}) {
  const [formData, setFormData] = useState({ title: "", postalCode: "" });
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const mapContainerStyle = useMemo(
    () => ({ width: "100%", height: "400px" }),
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const geocodePostalCode = async (postalCode) => {
    if (!window.google?.maps) throw new Error("Google Maps not loaded yet");
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: postalCode }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lng: loc.lng(), address: results[0].formatted_address });
        } else {
          reject(new Error("Geocode failed: " + status));
        }
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const loc = await geocodePostalCode(formData.postalCode.trim());
      setCoordinates(loc);

      // TODO: send to your backend
      // await axios.post('/organisers/events', { ...formData, location: loc })

      console.log("Saved payload:", { ...formData, location: loc });
    } catch (err) {
      setError("Could not find location for this postal code.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Location</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Beach Cleanup"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Postal Code *</label>
            <input
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., 460106"
            />
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 border text-red-700 rounded">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {isLoading ? "Finding Location..." : "Add Location"}
        </button>
      </form>

      <div className="border rounded-lg overflow-hidden">
        <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={coordinates || defaultCenter}
            zoom={coordinates ? 15 : defaultZoom}
          >
            {coordinates && <Marker position={coordinates} title={formData.title} />}
          </GoogleMap>
        </LoadScript>
      </div>

      {coordinates && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
          Location: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          {coordinates.address ? ` • ${coordinates.address}` : ""}
        </div>
      )}
    </div>
  );
}
