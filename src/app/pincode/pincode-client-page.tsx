
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
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n/use-translation";

type PincodeToStateMap = {
  [key: string]: string[];
};

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

export function PincodeClientPage() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [pincode, setPincode] = useState("");
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [searched, setSearched] = useState(false);
  const [pincodeMap, setPincodeMap] = useState<PincodeToStateMap | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

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

  const handleSearch = () => {
    if (pincode.trim().length !== 6 || !pincodeMap) {
        return;
    }
    startTransition(() => {
        setSearched(true);
        findPostOfficesByPincode(pincode, pincodeMap).then(setPostOffices);
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t('pincodePage.title')}</CardTitle>
          <CardDescription>
            {t('pincodePage.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder={t('pincodePage.placeholder')}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={6}
              disabled={isLoadingData}
            />
            <Button type="button" onClick={handleSearch} disabled={isPending || isLoadingData || pincode.length !== 6}>
              <Search className="mr-2 h-4 w-4" />
              {isPending ? t('pincodePage.searching') : t('pincodePage.search')}
            </Button>
          </div>

           <div className="w-full">
            <div className="hidden md:block">
              <ScrollArea className="h-[500px] border rounded-lg">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>{t('table.officeName')}</TableHead>
                      <TableHead>{t('table.pincode')}</TableHead>
                      <TableHead>{t('table.officeType')}</TableHead>
                      <TableHead>{t('table.taluka')}</TableHead>
                      <TableHead>{t('table.state')}</TableHead>
                      <TableHead>{t('table.division')}</TableHead>
                      <TableHead>{t('table.region')}</TableHead>
                      <TableHead>{t('table.circle')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPending || isLoadingData ? (
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
                            ? t('pincodePage.noResults')
                            : t('pincodePage.startSearch')}
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
                    {isPending || isLoadingData ? (
                        <div className='space-y-4'>
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : postOffices.length > 0 ? (
                        postOffices.map((po, index) => (
                            <Card key={`${po.officename}-${po.pincode}-${index}`} className="border rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="font-semibold col-span-2 text-base">{po.officename}</div>
                                    
                                    <div className="text-muted-foreground">{t('table.pincode')}</div>
                                    <div>{po.pincode}</div>
                                    
                                    <div className="text-muted-foreground">{t('table.officeType')}</div>
                                    <div>{po.officetype}</div>

                                    <div className="text-muted-foreground">{t('table.taluka')}</div>
                                    <div>{po.Taluk}</div>
                                    
                                    <div className="text-muted-foreground">{t('table.state')}</div>
                                    <div>{po.statename}</div>

                                    <div className="text-muted-foreground">{t('table.division')}</div>
                                    <div>{po.divisionname}</div>

                                    <div className="text-muted-foreground">{t('table.region')}</div>
                                    <div>{po.regionname}</div>

                                    <div className="text-muted-foreground">{t('table.circle')}</div>
                                    <div>{po.circlename}</div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="h-24 flex items-center justify-center text-center text-muted-foreground">
                            {searched
                            ? t('pincodePage.noResults')
                            : t('pincodePage.startSearch')}
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
