
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const LocationMap = dynamic(() => import("@/components/location-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
});

export function LocationClientPage() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapKey, setMapKey] = useState<number | null>(null);

  useEffect(() => {
    setMapKey(Date.now());
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setLocation(null); // Clear previous location
    setError(null);
    setMapKey(Date.now()); // Set a new unique key to force re-render

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = "An unknown error occurred while trying to get your location.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Permission to access location was denied. Please check your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      }
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Find My Location</CardTitle>
          <CardDescription>Click the button below to get your current geographic coordinates. You may need to grant location permissions in your browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={handleGetLocation}
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Fetching Location...
                </>
              ) : (
                "Get My Current Location"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {location && mapKey && (
             <div className="space-y-4">
              <div className="text-center p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Your Current Location
                </h3>
                <div className="font-mono text-lg space-y-2">
                  <p>
                    <span className="font-semibold">Latitude:</span>{" "}
                    {location.latitude.toFixed(6)}
                  </p>
                  <p>
                    <span className="font-semibold">Longitude:</span>{" "}
                    {location.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
              <LocationMap
                key={mapKey}
                latitude={location.latitude}
                longitude={location.longitude}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
