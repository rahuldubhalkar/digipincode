
import { promises as fs } from 'fs';
import path from 'path';
import { PostOffice } from './types';

/**
 * Fetches the list of districts for a given state.
 * If a dedicated districts file exists, it uses it.
 * Otherwise, it falls back to extracting unique districts from the main state data file.
 */
export async function getDistrictsByState(state: string): Promise<string[]> {
    const upperState = state.toUpperCase();
    const dataDir = path.join(process.cwd(), 'public', 'data');
    
    try {
        // Try dedicated districts file first
        const districtsPath = path.join(dataDir, `${upperState}-districts.json`);
        try {
            const fileContent = await fs.readFile(districtsPath, 'utf-8');
            const data = JSON.parse(fileContent);
            if (Array.isArray(data) && data.length > 0) {
                return data.sort();
            }
        } catch (e) {
            // File doesn't exist, proceed to fallback
        }

        // Fallback: Extract from the main state JSON file
        const statePath = path.join(dataDir, `${upperState}.json`);
        const stateContent = await fs.readFile(statePath, 'utf-8');
        const stateData: PostOffice[] = JSON.parse(stateContent);
        
        if (Array.isArray(stateData)) {
            const uniqueDistricts = [...new Set(stateData.map(po => po.district).filter(Boolean))];
            return uniqueDistricts.sort();
        }

        return [];
    } catch (error) {
        console.error(`Error fetching districts for ${state}:`, error);
        return [];
    }
}
