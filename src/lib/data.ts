import type { PostOffice } from './types';
import { unstable_noStore as noStore } from 'next/cache';

const API_KEY = '579b464db66ec23bdd000001f96a317e4daa449850b07ef3ce5c9f4a';
const API_URL = 'https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6';

async function fetchFromAPI(filters: Record<string, string>, limit: number = 1000, offset: number = 0): Promise<any[]> {
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
    // This API doesn't have a dedicated endpoint for states.
    // For this demonstration, we'll hardcode a list of states.
    // In a real-world application, you might pre-fetch and cache all records 
    // to build this list, or have a separate endpoint.
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


export async function getDistricts(state: string): Promise<string[]> {
  if (!state) return [];
  // Fetch a large number of records for the selected state to get all districts.
  const records = await fetchFromAPI({ 'statename': state }, 5000);
  if (!records) return [];
  const districtSet = new Set(records.map((r: any) => r.district));
  return Array.from(districtSet).sort() as string[];
}

export async function findPostOffices(filters: {
  state?: string;
  district?: string;
  searchTerm?: string;
  letter?: string;
}): Promise<PostOffice[]> {
  const apiFilters: Record<string, string> = {};
  if (filters.state) apiFilters['statename'] = filters.state;
  if (filters.district) apiFilters['district'] = filters.district;
  // The API doesn't support partial matches well, so we only filter by search term if it's long enough
  if (filters.searchTerm && filters.searchTerm.length > 2) apiFilters['officename'] = filters.searchTerm;

  let records = await fetchFromAPI(apiFilters, 1000);
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
