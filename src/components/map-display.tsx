"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "@/lib/i18n/use-translation";

// Fix for default marker icon issue with webpack
const icon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface MapDisplayProps {
  latitude: number;
  longitude: number;
}

export default function MapDisplay({ latitude, longitude }: MapDisplayProps) {
  const { t } = useTranslation();
  const position: [number, number] = [latitude, longitude];
  
  // By changing the key, we force React to unmount the old MapContainer and mount a new one.
  // This is the correct way to handle re-initialization with react-leaflet.
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    setMapKey(Date.now());
  }, [latitude, longitude]);

  return (
    <MapContainer
      key={mapKey}
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>{t("location.yourLocation")}</Popup>
      </Marker>
    </MapContainer>
  );
}
