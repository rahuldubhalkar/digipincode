
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
import { Search, MapPin, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PincodeToStateMap = {
  [key: string]: string[];
};

interface PincodeClientPageProps {
  states: string[];
}

async function findPostOfficesByPincode(pincode: string, pincodeMap: PincodeToStateMap): Promise<PostOffice[]> {
  if (!pincode || pincode.length !== 6) return [];

  const firstDigit = pincode.charAt(0);
  const statesToSearch = pincodeMap[firstDigit];

  if (!statesToSearch || statesToSearch.length === 0) {
    return [];
  }

  const searchPromises = statesToSearch.map(state =>
    fetch(`/data/${state}.json`).then(res => res.json() as Promise<PostOffice[]>)
  );
  
  try {
    const results = await Promise.all(searchPromises);
    const allPostOfficesForStates = results.flat();
    return allPostOfficesForStates.filter(po => po.pincode === pincode);
  } catch (error) {
    console.error("Failed to load or parse state data for pincode search", error);
    return [];
  }
}

async function findPostOfficesByName(name: string, state: string): Promise<PostOffice[]> {
    if (!name || !state) return [];
    try {
        const response = await fetch(`/data/${state}.json`);
        if (!response.ok) throw new Error("Failed to fetch state data");
        const postOffices: PostOffice[] = await response.json();
        return postOffices.filter(po => 
            po.officename.toLowerCase().includes(name.toLowerCase())
        );
    } catch (error) {
        console.error("Failed to search by office name", error);
        return [];
    }
}

export function PincodeClientPage({ states }: PincodeClientPageProps) {
  const [isPending, startTransition] = useTransition();
  const [pincode, setPincode] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [searched, setSearched] = useState(false);
  const [pincodeMap, setPincodeMap] = useState<PincodeToStateMap | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchMode, setSearchMode] = useState<"pincode" | "name">("pincode");

  useEffect(() => {
    fetch('/data/pincode_to_state.json')
      .then(res => res.json())
      .then(data => {
        setPincodeMap(data);
        setIsLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load pincode to state mapping", err);
        setIsLoadingData(false);
      });
  }, []);

  const handlePincodeSearch = () => {
    if (pincode.trim().length !== 6 || !pincodeMap) {
        return;
    }
    startTransition(() => {
        setSearched(true);
        findPostOfficesByPincode(pincode, pincodeMap).then(setPostOffices);
    });
  };

  const handleNameSearch = () => {
    if (!officeName.trim() || !selectedState) return;
    startTransition(() => {
        setSearched(true);
        findPostOfficesByName(officeName, selectedState).then(setPostOffices);
    });
  };

  const clearResults = () => {
    setPostOffices([]);
    setSearched(false);
    setPincode("");
    setOfficeName("");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-5xl mx-auto shadow-lg border-none">
        <CardHeader className="text-center bg-primary/5 rounded-t-lg pb-8">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Search className="h-8 w-8" />
            Find Post Office Details
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Search across the official All India Post Office directory by PIN Code or Office Name.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <Tabs defaultValue="pincode" onValueChange={(v) => { setSearchMode(v as any); clearResults(); }}>
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="pincode" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                By PIN Code
              </TabsTrigger>
              <TabsTrigger value="name" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                By Office Name
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pincode" className="space-y-6">
              <div className="flex flex-col md:flex-row w-full max-w-xl mx-auto items-center gap-4">
                <div className="w-full">
                  <label className="text-sm font-medium mb-1.5 block">Enter 6-digit PIN Code</label>
                  <Input
                    type="text"
                    placeholder="e.g. 110001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={6}
                    disabled={isLoadingData}
                    className="text-lg h-12"
                    suppressHydrationWarning
                  />
                </div>
                <Button 
                    type="button" 
                    onClick={handlePincodeSearch} 
                    disabled={isPending || isLoadingData || pincode.length !== 6}
                    size="lg"
                    className="w-full md:w-auto mt-auto"
                    suppressHydrationWarning
                >
                  <Search className="mr-2 h-5 w-5" />
                  {isPending ? "Searching..." : "Search"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="name" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full max-w-3xl mx-auto items-end">
                <div className="md:col-span-5">
                  <label className="text-sm font-medium mb-1.5 block">Office Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. Mumbai GPO"
                    value={officeName}
                    onChange={(e) => setOfficeName(e.target.value)}
                    disabled={isLoadingData}
                    className="h-12"
                    suppressHydrationWarning
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-sm font-medium mb-1.5 block">Select State</label>
                  <Select onValueChange={setSelectedState} value={selectedState} suppressHydrationWarning>
                    <SelectTrigger className="h-12" suppressHydrationWarning>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-64">
                        {states.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <Button 
                    type="button" 
                    onClick={handleNameSearch} 
                    disabled={isPending || !officeName.trim() || !selectedState}
                    className="w-full h-12"
                    suppressHydrationWarning
                  >
                    <Search className="mr-2 h-5 w-5" />
                    {isPending ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

           <div className="w-full pt-4">
            <div className="hidden md:block">
              <ScrollArea className="h-[600px] border rounded-lg shadow-inner">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead>Office Name</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead>Office Type</TableHead>
                      <TableHead>Taluka</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPending ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="space-y-2 p-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : postOffices.length > 0 ? (
                      postOffices.map((po, index) => (
                        <TableRow key={`${po.officename}-${po.pincode}-${index}`}>
                          <TableCell className="font-semibold text-primary">
                            {po.officename}
                          </TableCell>
                          <TableCell className="font-mono">{po.pincode}</TableCell>
                          <TableCell>{po.officetype}</TableCell>
                          <TableCell>{po.Taluk || 'N/A'}</TableCell>
                          <TableCell>{po.district}</TableCell>
                          <TableCell>{po.statename}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          {searched
                            ? "No results found matching your criteria. Please refine your search."
                            : `Enter a ${searchMode === 'pincode' ? 'PIN Code' : 'Office Name and State'} to start searching.`}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
             <div className="block md:hidden">
                <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                    {isPending ? (
                        <div className='space-y-4'>
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : postOffices.length > 0 ? (
                        postOffices.map((po, index) => (
                            <Card key={`${po.officename}-${po.pincode}-${index}`} className="border rounded-lg p-4 shadow-sm">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="font-bold col-span-2 text-base text-primary mb-1">{po.officename}</div>
                                    
                                    <div className="text-muted-foreground">Pincode</div>
                                    <div className="font-mono">{po.pincode}</div>
                                    
                                    <div className="text-muted-foreground">Office Type</div>
                                    <div>{po.officetype}</div>

                                    <div className="text-muted-foreground">Taluka</div>
                                    <div>{po.Taluk || 'N/A'}</div>
                                    
                                    <div className="text-muted-foreground">District</div>
                                    <div>{po.district}</div>

                                    <div className="text-muted-foreground">State</div>
                                    <div>{po.statename}</div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="h-32 flex items-center justify-center text-center text-muted-foreground px-4">
                            {searched
                            ? "No results found. Please check your spelling and try again."
                            : `Start an All India PIN Code search by entering a ${searchMode === 'pincode' ? 'code' : 'name'}.`}
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
