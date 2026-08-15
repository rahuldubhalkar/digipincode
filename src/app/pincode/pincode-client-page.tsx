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
      return results.flat().filter(po => {
        const name = (po.officename || (po as any).officename || '').toString().toLowerCase();
        const dist = (po.district || (po as any).District || (po as any).districtname || '').toString().toLowerCase();
        return name.includes(searchTerm) || dist.includes(searchTerm);
      });
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
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Enter 6-digit PIN or Post Office Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoadingConfig || isPending}
              className="pl-12 text-lg h-14 shadow-inner border-2 focus-visible:ring-primary"
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
            className="w-full md:w-32 h-14 text-lg font-bold shadow-lg transition-transform active:scale-95"
          >
            {isPending ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "Find"
            )}
          </Button>
        </div>
      </form>

      {searched && (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
          <ScrollArea className="h-[400px] border rounded-lg shadow-inner bg-card">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Office Name</TableHead>
                  <TableHead className="font-bold">Pincode</TableHead>
                  <TableHead className="font-bold">District</TableHead>
                  <TableHead className="font-bold">State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postOffices.length > 0 ? (
                  postOffices.map((po, index) => (
                    <TableRow key={`${po.officename}-${po.pincode}-${index}`} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-bold text-primary">
                        {po.officename || (po as any).officename}
                      </TableCell>
                      <TableCell className="font-mono bg-primary/5 rounded px-2">{po.pincode}</TableCell>
                      <TableCell>{po.district || (po as any).District || (po as any).districtname}</TableCell>
                      <TableCell className="text-muted-foreground">{po.statename}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Search className="h-10 w-10 text-muted-foreground/30" />
                            <p className="text-muted-foreground font-medium">No results found for "{searchQuery}"</p>
                        </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}