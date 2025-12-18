"use client";

import { useState, useTransition } from "react";
import { findPostOfficesByPincode } from "@/lib/data";
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
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PincodePage() {
  const [isPending, startTransition] = useTransition();
  const [pincode, setPincode] = useState("");
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (pincode.trim().length !== 6) {
        // Maybe show a toast notification for invalid pincode
        return;
    }
    startTransition(() => {
        setSearched(true);
        findPostOfficesByPincode(pincode).then(setPostOffices);
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Find by Pincode</CardTitle>
          <CardDescription>
            Enter a 6-digit pincode to find post office details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
              className="pl-10"
            />
            <Button type="button" onClick={handleSearch} disabled={isPending}>
              <Search className="mr-2 h-4 w-4" />
              {isPending ? "Searching..." : "Search"}
            </Button>
          </div>

          <div>
            <ScrollArea className="h-[500px] border rounded-lg">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Office Name</TableHead>
                    <TableHead>Pincode</TableHead>
                    <TableHead>Office Type</TableHead>
                    <TableHead>Taluk</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Circle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isPending ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : postOffices.length > 0 ? (
                    postOffices.map((po, index) => (
                      <TableRow key={`${po.officename}-${po.pincode}-${index}`}>
                        <TableCell className="font-medium">
                          {po.officename}
                        </TableCell>
                        <TableCell>{po.pincode}</TableCell>
                        <TableCell>{po.officetype}</TableCell>
                        <TableCell>{po.Taluk}</TableCell>
                        <TableCell>{po.statename}</TableCell>
                        <TableCell>{po.divisionname}</TableCell>
                        <TableCell>{po.regionname}</TableCell>
                        <TableCell>{po.circlename}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        {searched
                          ? "No results found for this pincode."
                          : "Enter a pincode to start a search."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
