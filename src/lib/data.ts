import fs from 'fs/promises';
import path from 'path';
import { PostOffice } from './types';

// A simple CSV parser. This will not handle complex cases like quoted commas.
// For this app's data, it's sufficient.
export async function loadPostOffices(): Promise<PostOffice[]> {
  const csvPath = path.join(process.cwd(), 'src', 'lib', 'pincode-data.csv');
  try {
    const csvData = await fs.readFile(csvPath, 'utf-8');
    const lines = csvData.trim().split('\n');
    
    if (lines.length < 2) {
      return [];
    }

    const headerLine = lines.shift();
    if (!headerLine) return [];

    const headers = headerLine.split(',').map(h => h.trim());

    return lines
      .map(line => {
        if (!line) return null;
        const values = line.split(',');
        const entry: Record<string, string> = {};
        headers.forEach((header, index) => {
          entry[header] = values[index]?.trim() || '';
        });
        return entry as unknown as PostOffice;
      })
      .filter((p): p is PostOffice => p !== null && !!p.OfficeName);
  } catch (error) {
    console.error("Failed to load or parse post office data:", error);
    return [];
  }
}
