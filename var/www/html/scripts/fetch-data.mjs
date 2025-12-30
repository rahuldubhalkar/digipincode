import fs from 'fs/promises';
import path from 'path';

async function fetchAndSaveData() {
  console.log('Starting data fetch...');
  
  const publicDataDir = path.join(process.cwd(), 'public', 'data');
  await fs.mkdir(publicDataDir, { recursive: true });

  const states = [
      "ANDAMAN AND NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM",
      "BIHAR", "CHANDIGARH", "CHHATTISGARH", "DADRA AND NAGAR HAVELI",
      "DAMAN AND DIU", "DELHI", "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH",
      "JAMMU AND KASHMIR", "JHARKHAND", "KARNATAKA", "KERALA", "LADAKH", "LAKSHADWEEP",
      "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND",
      "ODISHA", "PUDUCHERRY", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU",
      "TELANGANA", "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND", "WEST BENGAL"
  ].sort();

  try {
    const apiKey = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
    const response = await fetch(`https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6?api-key=${apiKey}&format=json&limit=300000`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const allData = await response.json();
    const records = allData.records;

    const allPostOffices = records.map((record) => ({
      officename: record.officename,
      pincode: record.pincode,
      officetype: record.officetype,
      deliverystatus: record.deliverystatus,
      district: record.district,
      statename: record.statename,
      regionname: record.regionname,
      circlename: record.circlename,
      divisionname: record.divisionname,
      Taluk: record.taluk,
    }));
    
    console.log(`Fetched ${allPostOffices.length} total post offices.`);

    // Write a single file with all post offices
    const allPostOfficesPath = path.join(publicDataDir, 'all_post_offices.json');
    await fs.writeFile(allPostOfficesPath, JSON.stringify(allPostOffices));
    console.log(`Successfully wrote all_post_offices.json`);

    // Group post offices by state
    const postOfficesByState = {};
    for (const po of allPostOffices) {
      if (!postOfficesByState[po.statename]) {
        postOfficesByState[po.statename] = [];
      }
      postOfficesByState[po.statename].push(po);
    }

    // Write individual state files
    for (const state of states) {
      if (postOfficesByState[state]) {
        const stateFilePath = path.join(publicDataDir, `${state}.json`);
        await fs.writeFile(stateFilePath, JSON.stringify(postOfficesByState[state]));
        console.log(`Successfully wrote ${state}.json`);
      } else {
         console.log(`No data for state: ${state}, creating empty file.`);
         const stateFilePath = path.join(publicDataDir, `${state}.json`);
         await fs.writeFile(stateFilePath, JSON.stringify([]));
      }
    }

    console.log('Data fetching and file writing complete.');
  } catch (error) {
    console.error("Error during data fetching script:", error);
    process.exit(1); // Exit with an error code
  }
}

fetchAndSaveData();
