
'use server';

import type { PostOffice } from './types';
import { unstable_noStore as noStore } from 'next/cache';

const API_KEY = '579b464db66ec23bdd000001f96a317e4daa449850b07ef3ce5c9f4a';
const API_URL = 'https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6';

async function fetchFromAPI(filters: Record<string, string>, limit: number = 1000, offset: number = 0): Promise<any> {
  noStore();
  
  const params = new URLSearchParams({
    'api-key': API_KEY,
    'format': 'json',
    'limit': limit.toString(),
    'offset': offset.toString(),
  });

  for (const key in filters) {
    if (filters[key]) {
      params.append(`filters[${key}]`, filters[key]);
    }
  }

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) {
      console.error('API request failed with status:', response.status);
      const errorBody = await response.text();
      console.error('Error body:', errorBody);
      return { records: [], total: 0 };
    }
    const data = await response.json();
    return {
        records: data.records || [],
        total: data.total || (data.records || []).length
    };
  } catch (error) {
    console.error("Failed to fetch data from API:", error);
    return { records: [], total: 0 };
  }
}

export async function getStates(): Promise<string[]> {
    return [
        "ANDAMAN AND NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM",
        "BIHAR", "CHANDIGARH", "CHHATTISGARH", "DADRA AND NAGAR HAVELI",
        "DAMAN AND DIU", "DELHI", "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH",
        "JAMMU AND KASHMIR", "JHARKHAND", "KARNATAKA", "KERALA", "LADAKH", "LAKSHADWEEP",
        "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND",
        "ODISHA", "PUDUCHERRY", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU",
        "TELANGANA", "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND", "WEST BENGAL"
    ].sort();
}


export async function getDivisions(state: string): Promise<string[]> {
  if (!state) return [];
  
  const BATCH_SIZE = 1000;
  let offset = 0;
  let allRecords: any[] = [];
  let totalAvailable = 0;

  // First, get the total number of records
  const initialFetch = await fetchFromAPI({ 'statename': state }, 1, 0);
  if (initialFetch && initialFetch.total) {
    totalAvailable = initialFetch.total;
  } else {
     // Fallback if total is missing, do one large fetch
     const fallbackFetch = await fetchFromAPI({ 'statename': state }, BATCH_SIZE, 0);
     const divisions = new Set(fallbackFetch.records.map((r: any) => r.divisionname));
     return Array.from(divisions).sort() as string[];
  }

  do {
    const { records } = await fetchFromAPI({ 'statename': state }, BATCH_SIZE, offset);
    if (!records || records.length === 0) break;
    
    allRecords = allRecords.concat(records);
    offset += records.length;

  } while (offset < totalAvailable);

  if (!allRecords.length) return [];
  
  const divisionSet = new Set(allRecords.map((r: any) => r.divisionname));
  return Array.from(divisionSet).sort() as string[];
}

export async function findPostOfficesByPincode(pincode: string): Promise<PostOffice[]> {
  if (!pincode) return [];
  const { records } = await fetchFromAPI({ 'pincode': pincode }, 100);
  if (!records) return [];
  return records.map((r: any) => ({
    officename: r.officename,
    pincode: r.pincode,
    officetype: r.officetype,
    deliverystatus: r.deliverystatus,
    district: r.district,
    statename: r.statename,
    regionname: r.regionname,
    circlename: r.circlename,
    divisionname: r.divisionname,
    Taluk: r.taluk
  }));
}

export async function findPostOffices(filters: {
  state?: string;
  division?: string;
  searchTerm?: string;
  letter?: string;
}): Promise<PostOffice[]> {
  const apiFilters: Record<string, string> = {};
  if (filters.state) apiFilters['statename'] = filters.state;
  if (filters.division) apiFilters['divisionname'] = filters.division;
  
  // If no filters are provided, don't fetch anything.
  if (!filters.state || !filters.division) {
    return [];
  }

  const BATCH_SIZE = 1000;
  let allRecords: any[] = [];

  const initialFetch = await fetchFromAPI(apiFilters, 1, 0);
  let totalAvailable = 0;
  if (initialFetch && initialFetch.total) {
    totalAvailable = initialFetch.total;
  }

  if (totalAvailable > 0) {
      let offset = 0;
      while(offset < totalAvailable) {
        const subsequentFetch = await fetchFromAPI(apiFilters, BATCH_SIZE, offset);
        if (!subsequentFetch.records || subsequentFetch.records.length === 0) break;
        allRecords = allRecords.concat(subsequentFetch.records);
        offset += subsequentFetch.records.length;
      }
  }


  // Client-side filtering
  if (filters.searchTerm) {
    allRecords = allRecords.filter((r: any) => r.officename.toLowerCase().includes(filters.searchTerm!.toLowerCase()));
  }

  if (filters.letter) {
      allRecords = allRecords.filter((r: any) => r.officename.toLowerCase().startsWith(filters.letter!.toLowerCase()));
  }

  return allRecords.map((r: any) => ({
      officename: r.officename,
      pincode: r.pincode,
      officetype: r.officetype,
      deliverystatus: r.deliverystatus,
      district: r.district,
      statename: r.statename,
      regionname: r.regionname,
      circlename: r.circlename,
      divisionname: r.divisionname,
      Taluk: r.taluk
  }));
}
