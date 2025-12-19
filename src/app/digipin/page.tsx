"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LocateFixed } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type Geolocation = {
  latitude: number;
  longitude: number;
};

export default function DigiPinPage() {
  const [location, setLocation] = useState<Geolocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetDigiPin = () => {
    setIsLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      toast({
        variant: "destructive",
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser.",
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = "An unknown error occurred.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "You denied the request for Geolocation.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }
        setError(errorMessage);
        toast({
            variant: "destructive",
            title: "Geolocation Error",
            description: errorMessage,
        });
        setIsLoading(false);
      }
    );
  };

  const mapSrc = location
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.01},${location.latitude-0.01},${location.longitude+0.01},${location.latitude+0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=-13.25,29.3,27.1,51.85&layer=mapnik`;

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Know Your DIGIPIN</CardTitle>
          <CardDescription>
            Get your precise digital address using your current location.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button onClick={handleGetDigiPin} disabled={isLoading}>
              <LocateFixed className="mr-2 h-4 w-4" />
              {isLoading ? "Getting Location..." : "Get my DIGIPIN"}
            </Button>
          </div>

          <div className="space-y-4 text-center">
            {isLoading && (
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-6 w-48" />
                </div>
            )}
            {error && <p className="text-destructive font-medium">{error}</p>}
            {location && !isLoading && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Your DIGIPIN is:</h3>
                <p className="text-2xl font-bold text-primary tracking-wider font-mono">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-muted-foreground">(Latitude, Longitude)</p>
              </div>
            )}
          </div>

          <div className="w-full h-96 rounded-lg overflow-hidden border">
            {isLoading ? (
                <Skeleton className="w-full h-full" />
            ) : (
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={mapSrc}
                    className="[&_a]:hidden"
                ></iframe>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
