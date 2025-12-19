"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LocateFixed, Copy, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type Geolocation = {
  latitude: number;
  longitude: number;
};

async function getDigiPinFromApi(latitude: number, longitude: number): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_DIGIPIN_API_KEY;
  if (!apiKey) {
    console.error("DIGIPIN API key is not configured.");
    throw new Error("API key is not configured.");
  }

  const url = new URL("https://digipin.sostabazar.in/api/generate.php");
  url.searchParams.append("lat", latitude.toString());
  url.searchParams.append("lon", longitude.toString());
  url.searchParams.append("api_key", apiKey);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data && data.digipin) {
      return data.digipin;
    } else {
      throw new Error("Invalid response from digipin API.");
    }
  } catch (error) {
    console.error("Failed to fetch from digipin API:", error);
    throw new Error("Could not generate DIGIPIN. Please try again.");
  }
}

export default function DigiPinPage() {
  const [location, setLocation] = useState<Geolocation | null>(null);
  const [digiPin, setDigiPin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleGetDigiPin = () => {
    setIsLoading(true);
    setError(null);
    setLocation(null);
    setDigiPin(null);
    
    if (!navigator.geolocation) {
      const errorMessage = "Geolocation is not supported by your browser.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Geolocation Error",
        description: errorMessage,
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        try {
          const code = await getDigiPinFromApi(coords.latitude, coords.longitude);
          setDigiPin(code);
        } catch (apiError: any) {
           setError(apiError.message);
           toast({
                variant: "destructive",
                title: "API Error",
                description: apiError.message,
            });
        } finally {
            setIsLoading(false);
        }
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
  
  const handleCopy = () => {
    if (digiPin) {
      navigator.clipboard.writeText(digiPin);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Your DIGIPIN has been copied to the clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  }

  const mapSrc = location
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.01},${location.latitude-0.01},${location.longitude+0.01},${location.latitude+0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=-13.25,29.3,27.1,51.85&layer=mapnik`;

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Know Your DIGIPIN</CardTitle>
          <CardDescription>
            Get a precise, shareable digital address for your current location.
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
                <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-center gap-4">
                        <div className="flex flex-col gap-2">
                           <Skeleton className="h-4 w-20" />
                           <Skeleton className="h-10 w-32" />
                        </div>
                         <div className="flex flex-col gap-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-12 w-80" />
                </div>
            )}
            {error && <p className="text-destructive font-medium">{error}</p>}
            {location && digiPin && !isLoading && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center gap-4">
                   <div>
                       <p className="text-xs text-muted-foreground font-semibold">LATITUDE</p>
                       <p className="font-mono p-2 border rounded-md bg-muted text-sm">{location.latitude.toFixed(6)}</p>
                   </div>
                    <div>
                       <p className="text-xs text-muted-foreground font-semibold">LONGITUDE</p>
                       <p className="font-mono p-2 border rounded-md bg-muted text-sm">{location.longitude.toFixed(6)}</p>
                   </div>
                </div>

                <div className="w-full max-w-sm text-center">
                    <p className="text-sm font-semibold text-muted-foreground">YOUR DIGIPIN</p>
                    <div className="relative mt-1">
                      <Button variant="secondary" size="lg" className="w-full text-xl font-bold text-primary tracking-widest font-mono pr-12" onClick={handleCopy}>
                          {digiPin}
                      </Button>
                      <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={handleCopy}>
                          {isCopied ? <Check className="h-5 w-5 text-green-500"/> : <Copy className="h-5 w-5" />}
                          <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                </div>
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
