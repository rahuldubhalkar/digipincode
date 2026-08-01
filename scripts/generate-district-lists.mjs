import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'public', 'data');

async function generateDistrictLists() {
  try {
    const files = await fs.readdir(dataDir);

    for (const file of files) {
      if (file.endsWith('.json') && !file.endsWith('-districts.json')) {
        const filePath = path.join(dataDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        let postOffices;
        try {
          postOffices = JSON.parse(fileContent);
        } catch (e) {
          console.error(`Error parsing JSON from ${file}:`, e);
          continue; // Skip to the next file
        }

        if (Array.isArray(postOffices) && postOffices.length > 0) {
          const districts = Array.from(new Set(postOffices.map(po => po.district).filter(Boolean)));
          const districtFilePath = path.join(dataDir, `${file.replace('.json', '')}-districts.json`);
          await fs.writeFile(districtFilePath, JSON.stringify(districts.sort(), null, 2));
          console.log(`Generated district list for ${file}`);
        } else {
          console.log(`Skipping empty or invalid data file: ${file}`);
        }
      }
    }

    console.log('All district lists generated successfully.');
  } catch (error) {
    console.error('Error generating district lists:', error);
  }
}

generateDistrictLists();
