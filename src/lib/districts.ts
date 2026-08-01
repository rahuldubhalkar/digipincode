import { promises as fs } from 'fs';
import path from 'path';

export async function getDistrictsByState(state: string): Promise<string[]> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', `${state.toUpperCase()}-districts.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}
