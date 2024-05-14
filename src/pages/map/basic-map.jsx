import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React, { useState, useEffect } from "react";

const giroIcon = L.icon({
  iconUrl: "../../../src/assets/images/logo/logo-giro.svg",
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

const BasicMap = ({ latitud, longitud }) => {
  const initialPosition = [latitud, longitud];
  const [address, setAddress] = useState("");

  useEffect(() => {
    const getAddressFromCoordinates = async (lat, lng) => {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setAddress(data.display_name);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getAddressFromCoordinates(latitud, longitud);
  }, [latitud, longitud]);

  return (
    <div className="w-full lg:h-full h-[300px]">
      <MapContainer
        center={initialPosition}
        zoom={16}
        minZoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={initialPosition}>
          <Popup>{address}</Popup>
        </Marker>
        <Marker position={[-28.44549082261326, -65.75916777403415]} icon={giroIcon}>
          <Popup>Punto Giro I - Av. México esq. Fiesta del Poncho</Popup>
        </Marker>
        <Marker position={[-28.497025261462788, -65.8160542196535]} icon={giroIcon}>
          <Popup>Punto Giro II - Av 12 S/número. Valle Chico</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default BasicMap;