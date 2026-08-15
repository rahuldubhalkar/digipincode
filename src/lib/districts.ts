
import { promises as fs } from 'fs';
import path from 'path';
import { PostOffice } from './types';

/**
 * Fetches the list of districts for a given state by reading the state's master JSON file.
 * This is more reliable than dedicated district files which may be out of sync.
 */
export async function getDistrictsByState(state: string): Promise<string[]> {
    const upperState = state.toUpperCase();
    const dataDir = path.join(process.cwd(), 'public', 'data');
    
    try {
        const statePath = path.join(dataDir, `${upperState}.json`);
        const stateContent = await fs.readFile(statePath, 'utf-8');
        const stateData: PostOffice[] = JSON.parse(stateContent);
        
        if (Array.isArray(stateData)) {
            // Handle both 'district' and 'District' cases in the source data
            const uniqueDistricts = [...new Set(stateData.map(po => {
                const district = po.district || (po as any).District;
                return district ? district.trim() : null;
            }).filter(Boolean))];
            
            return (uniqueDistricts as string[]).sort((a, b) => a.localeCompare(b));
        }

        return [];
    } catch (error) {
        console.error(`Error fetching districts for ${state}:`, error);
        return [];
    }
}

/**
 * Fetches all post offices for a state.
 */
export async function getPostOfficesByState(state: string): Promise<PostOffice[]> {
    const upperState = state.toUpperCase();
    const dataDir = path.join(process.cwd(), 'public', 'data');
    
    try {
        const statePath = path.join(dataDir, `${upperState}.json`);
        const stateContent = await fs.readFile(statePath, 'utf-8');
        const stateData: PostOffice[] = JSON.parse(stateContent);
        return Array.isArray(stateData) ? stateData : [];
    } catch (error) {
        console.error(`Error loading offices for state ${state}:`, error);
        return [];
    }
}
