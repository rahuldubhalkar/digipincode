"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  PackageSearch, 
  Search, 
  Loader2, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  MessageSquare,
  FileText,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { trackParcel } from "./actions";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
          <span className="text-primary">Speed Post</span> Tracking Online
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          Track your India Post parcels, Speed Post, and Registered Post items in real-time. The most accurate status update tool for 2025.
        </p>
      </div>

      {/* Main Search Component */}
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden bg-white rounded-3xl">
          <CardContent className="p-8 md:p-14">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-5 items-center">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground" />
                <Input
                  placeholder="Enter Tracking Number (e.g., EB123456789IN)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-16 h-20 text-2xl shadow-inner border-2 focus-visible:ring-primary rounded-2xl font-mono uppercase"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !trackingNumber.trim()} 
                size="lg"
                className="h-20 w-full md:w-auto px-12 text-2xl font-black shadow-2xl transition-all active:scale-95 bg-primary hover:bg-primary/90 rounded-2xl shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-8 w-8 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "TRACK NOW"
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-10 animate-in fade-in slide-in-from-top-2 border-2 rounded-2xl p-8">
                <AlertCircle className="h-8 w-8" />
                <AlertTitle className="text-2xl font-black mb-2">Tracking Error</AlertTitle>
                <AlertDescription className="text-xl font-medium">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Result Section */}
      {result && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-primary/5 border-primary/20 shadow-lg rounded-[2.5rem]">
              <CardContent className="p-10 text-center">
                <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.25em] mb-3">Current Status</p>
                <Badge className="text-2xl py-3 px-10 bg-primary text-white hover:bg-primary rounded-2xl shadow-xl">
                  {result.status}
                </Badge>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 text-white shadow-2xl rounded-[2.5rem]">
              <CardContent className="p-10 text-center">
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.25em] mb-3">Consignment ID</p>
                <p className="text-4xl font-mono font-black tracking-widest text-primary">{result.trackingNumber}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-100 shadow-lg rounded-[2.5rem]">
              <CardContent className="p-10 text-center">
                <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.25em] mb-3">Last Sync</p>
                <p className="text-2xl font-black flex items-center justify-center gap-3 text-slate-900">
                  <Clock className="h-7 w-7 text-primary" /> {result.lastUpdate}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-[0_35px_80px_-25px_rgba(0,0,0,0.15)] overflow-hidden rounded-[3rem] bg-white">
            <CardHeader className="bg-slate-50/80 border-b flex flex-row items-center gap-5 py-10 px-10">
              <TrendingUp className="h-10 w-10 text-primary" />
              <CardTitle className="text-4xl font-black text-slate-900">Live Shipment Movement</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b border-slate-100">
                  <div className="p-12 flex items-start gap-8 bg-slate-50/30">
                     <div className="bg-primary/10 p-6 rounded-[2rem] text-primary shadow-inner">
                        <MapPin className="h-12 w-12" />
                     </div>
                     <div>
                        <p className="text-sm text-muted-foreground font-black uppercase tracking-widest mb-1">Booking Hub</p>
                        <p className="text-3xl font-black text-slate-900 leading-tight">{result.origin}</p>
                     </div>
                  </div>
                  <div className="p-12 flex items-start gap-8 bg-slate-50/30">
                     <div className="bg-green-100 p-6 rounded-[2rem] text-green-600 shadow-inner">
                        <CheckCircle2 className="h-12 w-12" />
                     </div>
                     <div>
                        <p className="text-sm text-muted-foreground font-black uppercase tracking-widest mb-1">Final Destination</p>
                        <p className="text-3xl font-black text-slate-900 leading-tight">{result.destination}</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-10 md:p-20">
                  <div className="relative space-y-16 before:absolute before:inset-0 before:ml-9 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-2 before:bg-slate-100 overflow-hidden">
                    {result.events.length > 0 ? result.events.map((event, index) => (
                      <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className={cn(
                          "flex items-center justify-center w-20 h-20 rounded-full border-[10px] border-white shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-500 z-10",
                          index === 0 ? "bg-primary text-white scale-110" : "bg-slate-200 text-slate-500"
                        )}>
                          {index === 0 ? <TrendingUp className="h-10 w-10" /> : <CheckCircle2 className="h-9 w-9" />}
                        </div>
                        <div className="w-[calc(100%-6rem)] md:w-[calc(50%-6rem)] p-10 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm hover:shadow-2xl transition-all duration-300">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{event.status}</div>
                            <time className="font-mono text-sm font-bold text-primary bg-primary/10 px-5 py-2.5 rounded-2xl border border-primary/10">{event.time}</time>
                          </div>
                          <div className="text-xl text-slate-800 font-bold mb-4 flex items-center gap-4">
                             <MapPin className="h-6 w-6 text-primary" />
                             {event.location}
                          </div>
                          <Separator className="my-6 opacity-60" />
                          <div className="text-xl text-slate-600 leading-relaxed font-medium">{event.description}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-20 text-muted-foreground font-black text-2xl">
                        Waiting for shipment updates...
                      </div>
                    )}
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comprehensive SEO Content Section */}
      <div className="space-y-16 max-w-5xl mx-auto pt-10">
        
        {/* Intro Section */}
        <section className="space-y-6">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">How to do Speed POST Tracking online?</h2>
            <div className="text-xl text-slate-600 space-y-4 font-medium leading-relaxed">
                <p>
                    After successfully sending Speed POST Parcel at Speed POST Office, customer or sender are given a 13 characters Speed POST Tracking Number. Sender can do Speed POST Tracking of their parcels using these tracking numbers.
                </p>
                <p>
                    Let's have a look at How to do Speed POST Tracking online.
                </p>
            </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: Online */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-10 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="bg-primary p-4 rounded-2xl text-white shadow-lg">
                        <PackageSearch className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Option 1: Online Tracking</h3>
                </div>
                <div className="space-y-6 text-lg text-slate-600 font-medium">
                    <p>Track using 13 characters Tracking Number (e.g. EN441773442IN)</p>
                    <ol className="space-y-4">
                        <li className="flex gap-4"><span className="font-black text-primary">01.</span> Enter ID in form above.</li>
                        <li className="flex gap-4"><span className="font-black text-primary">02.</span> Use receipt ID from Post Office.</li>
                        <li className="flex gap-4"><span className="font-black text-primary">03.</span> Click "TRACK NOW".</li>
                        <li className="flex gap-4"><span className="font-black text-primary">04.</span> View live events and status.</li>
                    </ol>
                </div>
            </Card>

            {/* Option 2: SMS */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-10 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="bg-secondary p-4 rounded-2xl text-white shadow-lg">
                        <MessageSquare className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Option 2: SMS Tracking</h3>
                </div>
                <div className="space-y-6 text-lg text-slate-600 font-medium">
                    <p>Track your article (e.g. EE21234321IN) via SMS:</p>
                    <div className="bg-slate-100 p-6 rounded-2xl font-mono text-center font-bold text-slate-900 border border-slate-200">
                        POST TRACK EE21234321IN
                    </div>
                    <p className="text-center">Send to <span className="text-primary font-black">166</span> or <span className="text-primary font-black">51969</span></p>
                    <ul className="text-sm space-y-2 opacity-80 list-disc pl-5">
                        <li>SMS is case sensitive (use CAPITAL LETTERS).</li>
                        <li>Status available for up to 60 days.</li>
                        <li>Standard SMS rates apply.</li>
                    </ul>
                </div>
            </Card>
        </div>

        {/* Format Section */}
        <section className="bg-slate-900 text-white rounded-[3rem] p-10 md:p-16 space-y-8 shadow-2xl">
            <div className="flex items-center gap-5">
                <FileText className="h-10 w-10 text-primary" />
                <h2 className="text-3xl font-black tracking-tight">Speed Post Tracking Number Format</h2>
            </div>
            <p className="text-xl text-slate-300 leading-relaxed font-medium">
                A Speed Post tracking number should be made up of 13 digits and letters. It normally starts with two capital letters, then a nine-digit number, and ends with two capital letters. Because Speed Post is an Electronic Mail Service (EMS), the tracking number starts with E and ends with IN.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {["EE443212123IN", "EK665434234IN", "EG662345332IN"].map(ex => (
                    <div key={ex} className="bg-white/10 p-5 rounded-2xl text-center font-mono text-2xl font-black border border-white/10">
                        {ex}
                    </div>
                ))}
            </div>
        </section>

        {/* Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                    <MapPin className="h-8 w-8" />
                    <h2 className="text-3xl font-black text-slate-900">Addressing Tips</h2>
                </div>
                <ul className="space-y-4 text-lg text-slate-600 font-medium">
                    <li className="flex gap-4">✅ Always use the correct 6-digit PIN Code.</li>
                    <li className="flex gap-4">✅ Place addressee on front, sender on back.</li>
                    <li className="flex gap-4">✅ Ensure address is readable from distance.</li>
                    <li className="flex gap-4">✅ Leave 15mm blank space on all edges.</li>
                </ul>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                    <PackageSearch className="h-8 w-8" />
                    <h2 className="text-3xl font-black text-slate-900">Packaging Tips</h2>
                </div>
                <ul className="space-y-4 text-lg text-slate-600 font-medium">
                    <li className="flex gap-4">📦 Use sturdy cases or wrappers.</li>
                    <li className="flex gap-4">📦 For cloth, use a sturdy outer cardboard layer.</li>
                    <li className="flex gap-4">📦 Liquids must have a double container.</li>
                    <li className="flex gap-4">📦 Add sawdust for absorbing liquid leaks.</li>
                </ul>
            </section>
        </div>

        {/* Tariff Table */}
        <section className="space-y-8">
            <div className="flex items-center gap-5">
                <Truck className="h-10 w-10 text-primary" />
                <h2 className="text-3xl font-black text-slate-900">Speed POST Tariff Structure</h2>
            </div>
            <div className="border-2 rounded-[2.5rem] overflow-hidden bg-white shadow-xl">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-black h-16 text-lg">Weight</TableHead>
                            <TableHead className="font-black h-16 text-lg">Local</TableHead>
                            <TableHead className="font-black h-16 text-lg">Up to 200km</TableHead>
                            <TableHead className="font-black h-16 text-lg">201-1000km</TableHead>
                            <TableHead className="font-black h-16 text-lg">1001-2000km</TableHead>
                            <TableHead className="font-black h-16 text-lg">Above 2000km</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[
                            { w: "Up to 50g", l: "₹15", a: "₹35", b: "₹35", c: "₹35", d: "₹35" },
                            { w: "51g to 200g", l: "₹25", a: "₹35", b: "₹40", c: "₹60", d: "₹70" },
                            { w: "201g to 500g", l: "₹30", a: "₹50", b: "₹60", c: "₹80", d: "₹90" },
                            { w: "Addl 500g", l: "₹10", a: "₹15", b: "₹30", c: "₹40", d: "₹50" },
                        ].map((row, i) => (
                            <TableRow key={i} className="hover:bg-primary/5">
                                <TableCell className="font-bold py-5">{row.w}</TableCell>
                                <TableCell className="font-medium">{row.l}</TableCell>
                                <TableCell className="font-medium">{row.a}</TableCell>
                                <TableCell className="font-medium">{row.b}</TableCell>
                                <TableCell className="font-medium">{row.c}</TableCell>
                                <TableCell className="font-medium">{row.d}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-slate-500 italic px-4">* Taxes not included. Proof of Delivery (POD) fee is ₹10.00 per article.</p>
        </section>

        {/* Delivery Time Table */}
        <section className="space-y-8">
            <div className="flex items-center gap-5">
                <Clock className="h-10 w-10 text-primary" />
                <h2 className="text-3xl font-black text-slate-900">Delivery Time Norms</h2>
            </div>
            <div className="border-2 rounded-[2.5rem] overflow-hidden bg-white shadow-xl max-w-2xl mx-auto">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-black h-16 text-lg">Area - Distance</TableHead>
                            <TableHead className="font-black h-16 text-lg text-right">Average Days</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[
                            { a: "Local City", d: "1-2 Days" },
                            { a: "Metro to Metro", d: "1-3 Days" },
                            { a: "State Capital to Capital", d: "1-4 Days" },
                            { a: "Within Same State", d: "1-4 Days" },
                            { a: "Rest of Country", d: "4-5 Days" },
                        ].map((row, i) => (
                            <TableRow key={i} className="hover:bg-primary/5">
                                <TableCell className="font-bold py-5">{row.a}</TableCell>
                                <TableCell className="font-black text-right text-primary">{row.d}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-slate-500 italic text-center">For Branch Offices, one additional day will be taken.</p>
        </section>

        {/* Disclaimer */}
        <section className="bg-slate-50 border-2 rounded-[3rem] p-10 md:p-16 space-y-8">
            <div className="flex items-center gap-5">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <h2 className="text-3xl font-black text-slate-900">About digi-pincode Tracking</h2>
            </div>
            <div className="text-lg text-slate-600 space-y-6 font-medium leading-relaxed">
                <p>
                    digi-pincode is a professional Online Speed Post Tracking Application. You can check quickly Trace Speed Post status with this application. This tracker is non-governmental portal only for tracking purpose.
                </p>
                <p>
                    We have no affiliation or association to any government department / entity. Our tracking service is totally secure as we do not store any information or tracking numbers. This is not the official IndiaPost website (www.indiapost.gov.in).
                </p>
            </div>
        </section>

      </div>
    </div>
  );
}
