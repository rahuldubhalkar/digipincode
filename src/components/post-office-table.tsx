
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
              <ScrollArea className="h-[500px] border rounded-lg">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead suppressHydrationWarning>{t('table.officeName')}</TableHead>
                      <TableHead suppressHydrationWarning>{t('table.pincode')}</TableHead>
                      <TableHead suppressHydrationWarning>{t('table.officeType')}</TableHead>
                      <TableHead suppressHydrationWarning>{t('table.district')}</TableHead>
                      <TableHead suppressHydrationWarning>{t('table.state')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postOffices.length > 0 ? (
                      postOffices.map((po, index) => (
                        <TableRow key={`${po.officename}-${po.pincode}-${index}`}>
                          <TableCell className="font-medium">{po.officename}</TableCell>
                          <TableCell>{po.pincode}</TableCell>
                          <TableCell>{po.officetype}</TableCell>
                          <TableCell>{po.district}</TableCell>
                          <TableCell>{po.statename}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell suppressHydrationWarning colSpan={5} className="h-24 text-center">
                          {noResultsMessage}
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
                    {postOffices.length > 0 ? (
                        postOffices.map((po, index) => (
                            <Card key={`${po.officename}-${po.pincode}-${index}`} className="border rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="font-semibold col-span-2 text-base">{po.officename}</div>
                                    <div className="text-muted-foreground" suppressHydrationWarning>{t('table.pincode')}</div>
                                    <div>{po.pincode}</div>
                                    <div className="text-muted-foreground" suppressHydrationWarning>{t('table.officeType')}</div>
                                    <div>{po.officetype}</div>
                                    <div className="text-muted-foreground" suppressHydrationWarning>{t('table.district')}</div>
                                    <div>{po.district}</div>
                                    <div className="text-muted-foreground" suppressHydrationWarning>{t('table.state')}</div>
                                    <div>{po.statename}</div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div suppressHydrationWarning className="h-24 flex items-center justify-center text-center text-muted-foreground">
                            {noResultsMessage}
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
