'use server';

import type { PostOffice } from './types';
import { unstable_noStore as noStore } from 'next/cache';

const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const API_URL = 'https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6';

async function fetchFromAPI(filters: Record<string, string>, limit: number = 1000, offset: number = 0): Promise<any[]> {
  noStore();
  
  if (!API_KEY) {
    console.error('DATA_GOV_API_KEY is not set. Please provide it as an environment variable.');
    return [];
  }

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
      return [];
    }
    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error("Failed to fetch data from API:", error);
    return [];
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
  const records = await fetchFromAPI({ 'statename': state }, 5000);
  if (!records) return [];
  const divisionSet = new Set(records.map((r: any) => r.divisionname));
  return Array.from(divisionSet).sort() as string[];
}

export async function findPostOfficesByPincode(pincode: string): Promise<PostOffice[]> {
  if (!pincode) return [];
  const records = await fetchFromAPI({ 'pincode': pincode }, 100);
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
  
  let records = await fetchFromAPI(apiFilters, 2000);
  if (!records) return [];

  if (filters.searchTerm) {
    records = records.filter((r: any) => r.officename.toLowerCase().includes(filters.searchTerm!.toLowerCase()));
  }

  if (filters.letter) {
      records = records.filter((r: any) => r.officename.toLowerCase().startsWith(filters.letter!.toLowerCase()));
  }

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
