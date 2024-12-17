import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface City {
  name: string;
  coords: [number, number];
}
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],  // Size of the marker
    iconAnchor: [12, 41], // Anchor point of the icon
    popupAnchor: [1, -34], // Popup position relative to the icon
    shadowSize: [0, 0],    // Disable shadow
  });

const cities: City[] = [
  { name: "Dhaka", coords: [23.8103, 90.4125] },
  { name: "Chittagong", coords: [22.3569, 91.7832] },
  { name: "Khulna", coords: [22.8456, 89.5403] },
  { name: "Sylhet", coords: [24.8949, 91.8687] },
  { name: "Rajshahi", coords: [24.3745, 88.6042] },
  { name: "Mymensingh", coords: [24.7471, 90.4203] },
  { name: "Cumilla", coords: [23.4600, 91.1809] },
  { name: "Rangpur", coords: [25.7439, 89.2752] },
  { name: "Barishal", coords: [22.7010, 90.3535] },
  { name: "Narayanganj", coords: [23.6238, 90.5000] },
  { name: "Gazipur", coords: [23.9999, 90.4203] },
  { name: "Faridpur", coords: [23.6079, 89.8390] },
  { name: "Kushtia", coords: [23.9036, 89.1194] },
  { name: "Sirajganj", coords: [24.4534, 89.7000] },
  { name: "Savar", coords: [23.8583, 90.2667] },
  { name: "Bogura", coords: [24.8467, 89.3779] },
  { name: "Dinajpur", coords: [25.6277, 88.6332] },
  { name: "Noakhali", coords: [22.8696, 91.0999] },
  { name: "Feni", coords: [23.0159, 91.3976] },
  { name: "Lakshmipur", coords: [22.9460, 90.8300] },
  { name: "Cox's Bazar", coords: [21.4272, 92.0058] },
  { name: "Munshiganj", coords: [23.5435, 90.5305] },
  { name: "Tangail", coords: [24.2513, 89.9160] },
  { name: "Chuadanga", coords: [23.6406, 88.8410] },
  { name: "Jessore", coords: [23.1667, 89.2167] },
  { name: "Sunamganj", coords: [25.0658, 91.3950] },
  { name: "Manikganj", coords: [23.8644, 90.0047] }
];

const ServiceArea: React.FC = () => {
  useEffect(() => {
    // Initialize the map and set its view to Bangladesh's coordinates
    const map = L.map('mapid').setView([23.6850, 90.3563], 7);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Loop through the cities and add markers for each
    cities.forEach(city => {
      const marker = L.marker(city.coords, { icon: customIcon }).addTo(map);

      // Bind a popup to the marker
      marker.bindPopup(city.name);

      // Add event listeners for mouseover and mouseout
      marker.on('mouseover', function (this: L.Marker) {
        this.openPopup(); // Show the popup when the mouse enters
      });

      
    });

    // Cleanup function to remove map when component is unmounted
    return () => {
      map.remove();
    };
  }, []);

  return (
<div className="mx-auto p-4 h-screen mt-0 flex flex-col items-center justify-center">
  <h1 className="text-center text-4xl mb-10 tracking-tight text-black sm:text-3xl font-medium">
    Our Service Area
  </h1>

  <div id="mapid" className="w-full max-w-7xl h-[600px] rounded-lg shadow-lg border-2 border-gray-200">
   
  </div>
</div>



  );
};

export default ServiceArea;
