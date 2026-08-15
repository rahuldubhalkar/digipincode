"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PackageSearch, Search, Loader2, MapPin, CheckCircle2, Clock, AlertCircle, TrendingUp, History, Info, HelpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { trackParcel } from "./actions";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface TrackingEvent {
  time: string;
  location: string;
  description: string;
  status: string;
}

interface TrackingData {
  trackingNumber: string;
  status: string;
  lastUpdate: string;
  origin: string;
  destination: string;
  events: TrackingEvent[];
}

export function TrackingClientPage() {
  const { t } = useTranslation();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingNumber.trim();
    if (!query) {
      setError("Please enter a valid India Post tracking number.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await trackParcel(query);
      
      if (response.error) {
        setError(response.error);
        setResult(null);
      } else if (response.data) {
        setResult(response.data as TrackingData);
      }
    } catch (err) {
      setError("Unable to connect to India Post tracking service. Please try again later.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          <span className="text-primary">Real-Time</span> India Post Tracking
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
          Track Speed Post, Registered Post, and all domestic shipments with live status updates from India Post.
        </p>
      </div>

      {/* Main Search Component */}
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden bg-white rounded-3xl">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  placeholder="Enter 13-digit ID (e.g., EB123456789IN)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-14 h-16 text-xl shadow-inner border-2 focus-visible:ring-primary rounded-2xl"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !trackingNumber.trim()} 
                size="lg"
                className="h-16 px-12 text-xl font-black shadow-xl transition-transform active:scale-95 bg-primary hover:bg-primary/90 rounded-2xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Locating...
                  </>
                ) : (
                  "Track Now"
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-8 animate-in fade-in slide-in-from-top-2 border-2 rounded-2xl p-6">
                <AlertCircle className="h-6 w-6" />
                <AlertTitle className="text-xl font-black mb-1">Tracking Error</AlertTitle>
                <AlertDescription className="text-lg font-medium">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions & SEO Content Section */}
      {!result && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-none shadow-md bg-white rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">How to Track Your Parcel?</h2>
            </div>
            <ol className="space-y-4 text-slate-600 font-medium">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary">1</span>
                <span>Find your 13-digit tracking number on the receipt given by the post office.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary">2</span>
                <span>Enter the ID (e.g., EB123456789IN) into the search box above.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary">3</span>
                <span>Click "Track Now" to see the real-time movement and delivery status of your consignment.</span>
              </li>
            </ol>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <Info className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Supported Services</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Speed Post", "Registered Post", "India Post EMS", "Postal Life Insurance", 
                "Express Parcel", "Business Parcel", "Registered Packet", "Air Mail"
              ].map(tag => (
                <Badge key={tag} variant="secondary" className="px-4 py-2 text-sm font-bold bg-slate-100 text-slate-700 hover:bg-primary/10 transition-colors cursor-default">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-500 italic">
              *Consignments can be tracked for up to 60 days after the date of dispatch.
            </p>
          </Card>
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary/5 border-primary/10 shadow-md rounded-2xl">
              <CardContent className="p-8 text-center">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Current Status</p>
                <Badge className="text-xl py-2 px-8 bg-primary text-white hover:bg-primary rounded-xl">
                  {result.status}
                </Badge>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 text-white shadow-xl rounded-2xl">
              <CardContent className="p-8 text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Consignment ID</p>
                <p className="text-3xl font-mono font-black tracking-widest">{result.trackingNumber}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 border-slate-200 shadow-md rounded-2xl">
              <CardContent className="p-8 text-center">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Last Updated</p>
                <p className="text-xl font-bold flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> {result.lastUpdate}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white">
            <CardHeader className="bg-slate-50 border-b flex flex-row items-center gap-4 py-8 px-8">
              <TrendingUp className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-black text-slate-900">Movement Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b border-slate-100">
                  <div className="p-10 flex items-start gap-6 bg-slate-50/50">
                     <div className="bg-primary/10 p-5 rounded-3xl text-primary shadow-inner">
                        <MapPin className="h-10 w-10" />
                     </div>
                     <div>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Booking Office</p>
                        <p className="text-2xl font-black mt-2 text-slate-900">{result.origin}</p>
                     </div>
                  </div>
                  <div className="p-10 flex items-start gap-6 bg-slate-50/50">
                     <div className="bg-green-100 p-5 rounded-3xl text-green-600 shadow-inner">
                        <CheckCircle2 className="h-10 w-10" />
                     </div>
                     <div>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Delivery Point</p>
                        <p className="text-2xl font-black mt-2 text-slate-900">{result.destination}</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-8 md:p-14">
                  <div className="relative space-y-12 before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1.5 before:bg-slate-100 overflow-hidden">
                    {result.events.length > 0 ? result.events.map((event, index) => (
                      <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className={cn(
                          "flex items-center justify-center w-16 h-16 rounded-full border-[8px] border-white shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-500 z-10",
                          index === 0 ? "bg-primary text-white scale-110" : "bg-slate-200 text-slate-500"
                        )}>
                          {index === 0 ? <TrendingUp className="h-8 w-8" /> : <CheckCircle2 className="h-7 w-7" />}
                        </div>
                        <div className="w-[calc(100%-5rem)] md:w-[calc(50%-5rem)] p-8 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-2xl transition-all duration-300">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div className="text-2xl font-black text-slate-900 tracking-tight">{event.status}</div>
                            <time className="font-mono text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/10">{event.time}</time>
                          </div>
                          <div className="text-lg text-slate-700 font-bold mb-3 flex items-center gap-3">
                             <MapPin className="h-5 w-5 text-muted-foreground" />
                             {event.location}
                          </div>
                          <Separator className="my-4 opacity-50" />
                          <div className="text-lg text-slate-600 leading-relaxed font-medium">{event.description}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-20 text-muted-foreground font-black text-xl">
                        Tracking history is currently being synchronized.
                      </div>
                    )}
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
