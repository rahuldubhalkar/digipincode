
import type { PostOffice } from './types';

const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001f96a317e4daa449850b07ef3ce5c9f4a';
const API_URL = 'https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6';

async function fetchFromAPI(filters: Record<string, string>, limit: number = 1000, offset: number = 0): Promise<any> {
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

async function getAllRecordsForState(state: string): Promise<any[]> {
    const BATCH_SIZE = 1000;
    let offset = 0;
    let allRecords: any[] = [];
    
    // First, get the total count of records.
    const initialFetch = await fetchFromAPI({ 'statename': state }, 1, 0);
    const totalAvailable = initialFetch.total || 0;

    if (totalAvailable === 0) {
        return [];
    }

    // Create all fetch promises to run in parallel.
    const fetchPromises: Promise<any>[] = [];
    for (offset = 0; offset < totalAvailable; offset += BATCH_SIZE) {
        fetchPromises.push(fetchFromAPI({ 'statename': state }, BATCH_SIZE, offset));
    }

    const results = await Promise.all(fetchPromises);
    
    for (const result of results) {
        if (result.records) {
            allRecords = allRecords.concat(result.records);
        }
    }

    return allRecords;
}

export async function getPostOfficesByState(state: string): Promise<PostOffice[]> {
    if (!state) return [];
    const allRecords = await getAllRecordsForState(state);

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
