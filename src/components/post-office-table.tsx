
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
import { Card } from "@/components/ui/card";
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
              <ScrollArea className="h-[600px] border rounded-lg">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead className="w-[200px]">Office Name</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead>Office Type</TableHead>
                      <TableHead>Taluka / Tehsil</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postOffices.length > 0 ? (
                      postOffices.map((po, index) => {
                        const district = po.district || (po as any).District || (po as any).districtname || 'N/A';
                        const taluka = po.Taluk || (po as any).taluk || po.divisionname || 'N/A';
                        
                        return (
                          <TableRow key={`${po.officename}-${po.pincode}-${index}`} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium text-primary">{po.officename}</TableCell>
                            <TableCell className="font-mono bg-primary/5 px-2 rounded">{po.pincode}</TableCell>
                            <TableCell>{po.officetype}</TableCell>
                            <TableCell>{taluka}</TableCell>
                            <TableCell>{district}</TableCell>
                            <TableCell>{po.statename}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
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
                            const district = po.district || (po as any).District || (po as any).districtname || 'N/A';
                            const taluka = po.Taluk || (po as any).taluk || po.divisionname || 'N/A';

                            return (
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
                                                <p>{taluka}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-semibold">District</p>
                                                <p>{district}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-semibold">State</p>
                                                <p className="truncate">{po.statename}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="h-24 flex items-center justify-center text-center text-muted-foreground">
                            {noResultsMessage}
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
