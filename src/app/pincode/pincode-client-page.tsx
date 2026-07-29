
"use client";

import { useState, useTransition, useEffect } from "react";
import type { PostOffice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MapPin, Building2, Loader2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type PincodeToStateMap = {
  [key: string]: string[];
};

interface PincodeClientPageProps {
  states: string[];
}

async function searchPincode(query: string, pincodeMap: PincodeToStateMap, allStates: string[]): Promise<PostOffice[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  // Check if it's a 6-digit PIN code
  const isPincode = /^\d{6}$/.test(trimmedQuery);

  if (isPincode) {
    const firstDigit = trimmedQuery.charAt(0);
    const statesToSearch = pincodeMap[firstDigit] || [];
    if (statesToSearch.length === 0) return [];

    const searchPromises = statesToSearch.map(state =>
      fetch(`/data/${state}.json`).then(res => res.json() as Promise<PostOffice[]>)
    );
    
    try {
      const results = await Promise.all(searchPromises);
      return results.flat().filter(po => po.pincode === trimmedQuery);
    } catch (error) {
      console.error("Failed to search by pincode", error);
      return [];
    }
  } else {
    // Search by name across all states
    // Note: In a production app, this would be an API call. 
    // For this prototype, we search all JSON files.
    const searchPromises = allStates.map(state =>
      fetch(`/data/${state}.json`)
        .then(res => {
            if (!res.ok) return [];
            return res.json() as Promise<PostOffice[]>;
        })
        .catch(() => [] as PostOffice[])
    );

    try {
      const results = await Promise.all(searchPromises);
      const searchTerm = trimmedQuery.toLowerCase();
      return results.flat().filter(po => 
        po.officename.toLowerCase().includes(searchTerm) || 
        (po.district && po.district.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error("Failed to search by name", error);
      return [];
    }
  }
}

export function PincodeClientPage({ states }: PincodeClientPageProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [searched, setSearched] = useState(false);
  const [pincodeMap, setPincodeMap] = useState<PincodeToStateMap | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  useEffect(() => {
    fetch('/data/pincode_to_state.json')
      .then(res => res.json())
      .then(data => {
        setPincodeMap(data);
        setIsLoadingConfig(false);
      })
      .catch(err => {
        console.error("Failed to load pincode to state mapping", err);
        setIsLoadingConfig(false);
      });
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || !pincodeMap) return;

    startTransition(async () => {
      setSearched(true);
      const results = await searchPincode(searchQuery, pincodeMap, states);
      setPostOffices(results);
    });
  };

  const clearResults = () => {
    setPostOffices([]);
    setSearched(false);
    setSearchQuery("");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-5xl mx-auto shadow-lg border-none">
        <CardHeader className="text-center bg-primary/5 rounded-t-lg pb-8">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Search className="h-8 w-8" />
            PIN Code & Office Finder
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Enter a 6-digit PIN code or a Post Office name to find details across all India.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Enter PIN Code or Office Name (e.g. 110001 or Mumbai GPO)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoadingConfig || isPending}
                  className="pl-12 text-lg h-14 shadow-sm"
                  suppressHydrationWarning
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={clearResults}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isPending || isLoadingConfig || !searchQuery.trim()}
                size="lg"
                className="w-full md:w-32 h-14 text-lg font-semibold transition-all hover:scale-105"
                suppressHydrationWarning
              >
                {isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center md:text-left px-2">
                Tip: Search by PIN code for specific areas, or office name for a broader search.
            </p>
          </form>

          <div className="w-full pt-4">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <ScrollArea className="h-[600px] border rounded-lg shadow-inner bg-card">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-bold">Office Name</TableHead>
                      <TableHead className="font-bold">Pincode</TableHead>
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Taluka</TableHead>
                      <TableHead className="font-bold">District</TableHead>
                      <TableHead className="font-bold">State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPending ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : postOffices.length > 0 ? (
                      postOffices.map((po, index) => (
                        <TableRow key={`${po.officename}-${po.pincode}-${index}`} className="hover:bg-primary/5 transition-colors">
                          <TableCell className="font-bold text-primary">
                            {po.officename}
                          </TableCell>
                          <TableCell className="font-mono bg-primary/5 rounded px-2">{po.pincode}</TableCell>
                          <TableCell>{po.officetype}</TableCell>
                          <TableCell>{po.Taluk || 'N/A'}</TableCell>
                          <TableCell>{po.district}</TableCell>
                          <TableCell>{po.statename}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-64 text-center">
                          {searched
                            ? (
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <Search className="h-10 w-10 text-muted-foreground/30" />
                                    <p className="text-muted-foreground font-medium">No results found for "{searchQuery}"</p>
                                    <Button variant="link" onClick={clearResults}>Clear search and try again</Button>
                                </div>
                            )
                            : (
                                <div className="text-muted-foreground flex flex-col items-center gap-2">
                                    <MapPin className="h-12 w-12 opacity-10" />
                                    <p>Start an All India PIN Code search above.</p>
                                </div>
                            )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
                <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                    {isPending ? (
                        Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)
                    ) : postOffices.length > 0 ? (
                        postOffices.map((po, index) => (
                            <Card key={`${po.officename}-${po.pincode}-${index}`} className="border-l-4 border-l-primary overflow-hidden shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-primary text-lg">{po.officename}</h3>
                                        <span className="font-mono bg-primary/10 text-primary px-2 py-1 rounded text-sm font-bold">
                                            {po.pincode}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 text-sm border-t pt-3">
                                        <div>
                                            <p className="text-muted-foreground text-xs uppercase font-semibold">Office Type</p>
                                            <p>{po.officetype}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs uppercase font-semibold">Taluka</p>
                                            <p>{po.Taluk || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs uppercase font-semibold">District</p>
                                            <p>{po.district}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs uppercase font-semibold">State</p>
                                            <p className="truncate">{po.statename}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
                            <Building2 className="h-12 w-12 opacity-10" />
                            <p>{searched ? `No results for "${searchQuery}"` : "Search across 155,000+ Indian post offices."}</p>
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
