
"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PackageSearch, Search, Loader2, MapPin, CheckCircle2, Clock, AlertCircle, TrendingUp, History } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { trackParcel } from "./actions";
import { cn } from "@/lib/utils";

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
      setError(t('tracking.errorInvalid'));
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
      setError(t('tracking.errorGeneric'));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      <Card className="shadow-2xl border-none overflow-hidden ring-1 ring-black/5">
        <CardHeader className="text-center bg-gradient-to-br from-secondary to-primary/90 text-white pb-12 pt-10">
          <div className="flex justify-center mb-6">
             <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md shadow-lg">
                <PackageSearch className="h-10 w-10 text-white" />
             </div>
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight">
            India Post Tracking
          </CardTitle>
          <CardDescription className="text-white/80 text-xl mt-3 max-w-2xl mx-auto">
            Real-time status updates for Speed Post, Registered Post, and Parcels.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-10 px-6 md:px-12 -mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-muted/20">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  placeholder="Enter 13-digit number (e.g., EB123456789IN)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-14 h-16 text-xl shadow-inner border-2 focus-visible:ring-primary rounded-xl"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !trackingNumber.trim()} 
                size="lg"
                className="h-16 px-12 text-xl font-bold shadow-lg transition-transform active:scale-95 bg-primary hover:bg-primary/90 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  "Track Now"
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-8 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Search Error</AlertTitle>
                <AlertDescription className="text-base">{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary/5 border-primary/10 shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                <Badge className="text-lg py-1 px-4 bg-primary text-white hover:bg-primary">
                  {result.status}
                </Badge>
              </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-secondary/10 shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Tracking Number</p>
                <p className="text-2xl font-mono font-black text-secondary">{result.trackingNumber}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-muted shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Last Update</p>
                <p className="text-lg font-bold flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> {result.lastUpdate}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b flex flex-row items-center gap-4 py-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">Shipment Route</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b">
                  <div className="p-8 flex items-start gap-5">
                     <div className="bg-primary/20 p-4 rounded-2xl text-primary">
                        <MapPin className="h-8 w-8" />
                     </div>
                     <div>
                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Origin Location</p>
                        <p className="text-xl font-black mt-1">{result.origin}</p>
                     </div>
                  </div>
                  <div className="p-8 flex items-start gap-5">
                     <div className="bg-green-500/20 p-4 rounded-2xl text-green-700">
                        <CheckCircle2 className="h-8 w-8" />
                     </div>
                     <div>
                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">Destination Office</p>
                        <p className="text-xl font-black mt-1">{result.destination}</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-8">
                  <h3 className="text-2xl font-black mb-10 flex items-center gap-3 text-secondary">
                    <History className="h-7 w-7" />
                    Movement History
                  </h3>
                  <div className="relative space-y-10 pl-8 md:pl-0 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary/10 before:via-primary/50 before:to-transparent">
                    {result.events.length > 0 ? result.events.map((event, index) => (
                      <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors",
                          index === 0 ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                        )}>
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3.5rem)] p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div className="text-xl font-black text-slate-900">{event.status}</div>
                            <time className="font-mono text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{event.time}</time>
                          </div>
                          <div className="text-md text-slate-700 font-bold mb-2 flex items-center gap-2">
                             <MapPin className="h-4 w-4 text-muted-foreground" />
                             {event.location}
                          </div>
                          <div className="text-base text-slate-600 leading-relaxed">{event.description}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 text-muted-foreground">
                        Tracking history is currently being compiled.
                      </div>
                    )}
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      <section className="bg-card rounded-2xl p-10 shadow-xl border-t-4 border-t-primary space-y-8">
         <h2 className="text-3xl font-black tracking-tight text-center text-secondary">Help & Support</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
               <h3 className="text-xl font-black text-primary">Standard Tracking Formats</h3>
               <p className="text-muted-foreground leading-relaxed">
                 India Post tracking numbers typically consist of 13 characters.
                 Examples: <code className="bg-muted px-2 rounded font-bold">EE123456789IN</code> (Speed Post), <code className="bg-muted px-2 rounded font-bold">RR123456789IN</code> (Registered Post).
               </p>
            </div>
            <div className="space-y-3">
               <h3 className="text-xl font-black text-primary">Official Contact</h3>
               <p className="text-muted-foreground leading-relaxed">
                 For urgent inquiries regarding your shipment delivery, please contact the India Post Toll-Free number at <span className="font-bold text-foreground">1800 266 6868</span> or visit your local post office.
               </p>
            </div>
         </div>
      </section>
    </main>
  );
}
