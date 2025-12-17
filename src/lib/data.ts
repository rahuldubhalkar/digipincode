import fs from 'fs/promises';
import path from 'path';
import type { PostOffice } from './types';
import { unstable_noStore as noStore } from 'next/cache';

// A simple CSV parser. This will not handle complex cases like quoted commas.
// For this app's data, it's sufficient.
export async function loadPostOffices(): Promise<PostOffice[]> {
  noStore();
  const csvPath = path.join(process.cwd(), 'src', 'lib', 'pincode-data.csv');
  try {
    const csvData = await fs.readFile(csvPath, 'utf-8');
    const lines = csvData.trim().split('\n');
    
    if (lines.length < 2) {
      return [];
    }

    const headerLine = lines.shift();
    if (!headerLine) return [];

    const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
    
    const officenameIndex = headers.indexOf('officename');
    const pincodeIndex = headers.indexOf('pincode');
    const officetypeIndex = headers.indexOf('officetype');
    const deliveryIndex = headers.indexOf('delivery');
    const districtIndex = headers.indexOf('district');
    const statenameIndex = headers.indexOf('statename');
    const regionnameIndex = headers.indexOf('regionname');
    const circlenameIndex = headers.indexOf('circlename');
    const divisionnameIndex = headers.indexOf('divisionname');


    return lines
      .map(line => {
        if (!line) return null;
        // This regex handles quoted commas
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
        
        return {
            OfficeName: values[officenameIndex] || '',
            Pincode: values[pincodeIndex] || '',
            OfficeType: values[officetypeIndex] || '',
            Delivery: values[deliveryIndex] || '',
            District: values[districtIndex] || '',
            StateName: values[statenameIndex] || '',
            Region: values[regionnameIndex] || '',
            Circle: values[circlenameIndex] || '',
            Division: values[divisionnameIndex] || '',
        } as PostOffice;
      })
      .filter((p): p is PostOffice => p !== null && !!p.OfficeName);
  } catch (error) {
    console.error("Failed to load or parse post office data:", error);
    return [];
  }
}
