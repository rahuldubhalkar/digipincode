
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
import { useTranslation } from "@/lib/i18n/use-translation";

interface PostOfficeTableProps {
    postOffices: PostOffice[];
    searched?: boolean;
}

export function PostOfficeTable({ postOffices, searched = true }: PostOfficeTableProps) {
    const { t } = useTranslation();
    const noResultsMessage = searched ? t('home.noResults') : t('home.selectFilter');

    return (
        <div className="w-full">
            <div className="hidden md:block">
              <ScrollArea className="h-[600px] border rounded-lg bg-card shadow-inner">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[250px] font-bold text-primary">{t('table.officeName')}</TableHead>
                      <TableHead className="font-bold text-primary">{t('table.pincode')}</TableHead>
                      <TableHead className="font-bold text-primary">{t('table.officeType')}</TableHead>
                      <TableHead className="font-bold text-primary">{t('table.district')}</TableHead>
                      <TableHead className="font-bold text-primary">{t('table.division')}</TableHead>
                      <TableHead className="font-bold text-primary">{t('table.state')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postOffices.length > 0 ? (
                      postOffices.map((po, index) => {
                        if (!po) return null;
                        
                        // Robust deep property lookup for inconsistent JSON keys
                        const officeName = po.officename || (po as any).officename || (po as any).OfficeName || 'N/A';
                        const pincode = po.pincode || (po as any).Pincode || (po as any).pincode || 'N/A';
                        const officeType = po.officetype || (po as any).OfficeType || (po as any).officetype || 'N/A';
                        const district = po.district || (po as any).District || (po as any).districtname || (po as any).Districtname || 'N/A';
                        const division = po.divisionname || (po as any).Divisionname || (po as any).divisionname || (po as any).Taluk || 'N/A';
                        const state = po.statename || (po as any).Statename || (po as any).statename || 'N/A';
                        
                        return (
                          <TableRow key={`${officeName}-${pincode}-${index}`} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="font-black text-primary">{officeName}</TableCell>
                            <TableCell className="font-mono bg-primary/10 px-3 py-1 rounded-md font-black text-primary">{pincode}</TableCell>
                            <TableCell className="text-sm font-medium">{officeType}</TableCell>
                            <TableCell className="text-sm font-bold text-secondary">{district}</TableCell>
                            <TableCell className="text-sm">{division}</TableCell>
                            <TableCell className="text-sm font-bold text-muted-foreground">{state}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-64 text-center text-lg font-bold text-muted-foreground">
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
                            const officeName = po.officename || (po as any).officename || (po as any).OfficeName || 'N/A';
                            const pincode = po.pincode || (po as any).Pincode || (po as any).pincode || 'N/A';
                            const officeType = po.officetype || (po as any).OfficeType || (po as any).officetype || 'N/A';
                            const district = po.district || (po as any).District || (po as any).districtname || (po as any).Districtname || 'N/A';
                            const division = po.divisionname || (po as any).Divisionname || (po as any).divisionname || (po as any).Taluk || 'N/A';
                            const state = po.statename || (po as any).Statename || (po as any).statename || 'N/A';

                            return (
                                <Card key={`${officeName}-${pincode}-${index}`} className="border-l-8 border-l-primary overflow-hidden shadow-md">
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-black text-primary text-xl leading-tight">{officeName}</h3>
                                            <span className="font-mono bg-primary/10 text-primary px-3 py-1 rounded-lg text-lg font-black">
                                                {pincode}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-black mb-1">Type</p>
                                                <p className="font-bold">{officeType}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-black mb-1">District</p>
                                                <p className="font-bold text-secondary">{district}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-black mb-1">Division</p>
                                                <p className="font-bold">{division}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase font-black mb-1">State</p>
                                                <p className="font-bold text-muted-foreground">{state}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="h-64 flex items-center justify-center text-center text-muted-foreground font-bold">
                            {noResultsMessage}
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
