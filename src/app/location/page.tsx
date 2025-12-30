
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: 'My Location',
    description: 'Use the My Location feature to get your current geographic coordinates (latitude and longitude) instantly. Requires browser location permissions.',
  };
}

// Dynamically import the map component to prevent SSR issues
const LocationMap = dynamic(() => import("@/components/location-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
});

export default function LocationPage() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapKey, setMapKey] = useState<number>(Date.now());

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError(t("location.geolocationNotSupported"));
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
        let errorMessage = t("location.error.generic");
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = t("location.error.permissionDenied");
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = t("location.error.positionUnavailable");
            break;
          case err.TIMEOUT:
            errorMessage = t("location.error.timeout");
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
          <CardTitle className="text-3xl">{t("location.title")}</CardTitle>
          <CardDescription>{t("location.description")}</CardDescription>
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
                  {t("location.loading")}
                </>
              ) : (
                t("location.button")
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t("location.error.title")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {location && (
             <div className="space-y-4">
              <div className="text-center p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  {t("location.yourLocation")}
                </h3>
                <div className="font-mono text-lg space-y-2">
                  <p>
                    <span className="font-semibold">{t("location.latitude")}:</span>{" "}
                    {location.latitude.toFixed(6)}
                  </p>
                  <p>
                    <span className="font-semibold">{t("location.longitude")}:</span>{" "}
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
