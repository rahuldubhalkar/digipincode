
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/use-translation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface SearchFormProps {
  states: string[];
  initialState?: string;
  initialSearchTerm?: string;
}

export function SearchForm({ states, initialState = '', initialSearchTerm = '' }: SearchFormProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedState, setSelectedState] = useState(initialState);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState) return;
    const params = new URLSearchParams();
    params.set('state', selectedState);
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    router.push(`/search?${params.toString()}`);
  };

  const clearSearch = () => {
      setSelectedState('');
      setSearchTerm('');
      router.push('/');
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
            <label className="text-sm font-medium">{t('home.selectState')}</label>
            <Select onValueChange={setSelectedState} value={selectedState}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('home.selectState')} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">{t('home.searchByBranch')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('home.searchByBranch')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
        </div>

        <div className="flex gap-2">
            <Button type="submit" disabled={!selectedState} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              {t('pincodePage.search')}
            </Button>
             <Button type="button" variant="outline" onClick={clearSearch} className="text-primary hover:text-primary">
              <X className="mr-2 h-4 w-4" />
              {t('home.clearFilters')}
            </Button>
        </div>
      </div>
    </form>
  );
}
