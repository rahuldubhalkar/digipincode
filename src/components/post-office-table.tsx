"use client";

import type { PostOffice } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PostOfficeTableProps {
    postOffices: PostOffice[];
    searched?: boolean;
}

export function PostOfficeTable({ postOffices, searched = true }: PostOfficeTableProps) {
    const noResultsMessage = searched ? "No Post Office found. Try adjusting your filters." : "Select a state or district to begin your post office search.";

    return (
        <div className="w-full">
            <div className="hidden md:block">
              <ScrollArea className="h-[600px] border rounded-lg bg-card">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                    <TableRow>
                      <TableHead className="w-[250px] font-bold">Office Name</TableHead>
                      <TableHead className="font-bold">Pincode</TableHead>
                      <TableHead className="font-bold">Office Type</TableHead>
                      <TableHead className="font-bold">Taluka / Tehsil</TableHead>
                      <TableHead className="font-bold">District</TableHead>
                      <TableHead className="font-bold">State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postOffices.length > 0 ? (
                      postOffices.map((po, index) => {
                        if (!po) return null;
                        // Robust property lookup
                        const district = po.district || (po as any).District || (po as any).districtname || (po as any).Districtname || 'N/A';
                        const taluka = po.Taluk || (po as any).taluk || (po as any).Taluka || po.divisionname || 'N/A';
                        const officeName = po.officename || (po as any).officename || 'Unknown';
                        
                        return (
                          <TableRow key={`${officeName}-${po.pincode}-${index}`} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="font-bold text-primary">{officeName}</TableCell>
                            <TableCell className="font-mono bg-primary/10 px-2 rounded font-bold">{po.pincode}</TableCell>
                            <TableCell className="text-sm">{po.officetype}</TableCell>
                            <TableCell className="text-sm">{taluka}</TableCell>
                            <TableCell className="text-sm">{district}</TableCell>
                            <TableCell className="text-sm font-medium">{po.statename}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-64 text-center">
                          {noResultsMessage}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
             <div className="block md:hidden">
                <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                    {postOffices.length > 0 ? (
                        postOffices.map((po, index) => {
                            if (!po) return null;
                            const district = po.district || (po as any).District || (po as any).districtname || (po as any).Districtname || 'N/A';
                            const taluka = po.Taluk || (po as any).taluk || (po as any).Taluka || po.divisionname || 'N/A';
                            const officeName = po.officename || (po as any).officename || 'Unknown';

                            return (
                                <Card key={`${officeName}-${po.pincode}-${index}`} className="border-l-4 border-l-primary overflow-hidden shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-primary text-lg">{officeName}</h3>
                                            <span className="font-mono bg-primary/10 text-primary px-2 py-1 rounded text-sm font-bold">
                                                {po.pincode}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-2 text-sm border-t pt-3">
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-bold">Office Type</p>
                                                <p>{po.officetype}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-bold">Taluka</p>
                                                <p>{taluka}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-bold">District</p>
                                                <p>{district}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-bold">State</p>
                                                <p className="truncate font-medium">{po.statename}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="h-64 flex items-center justify-center text-center text-muted-foreground">
                            {noResultsMessage}
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}