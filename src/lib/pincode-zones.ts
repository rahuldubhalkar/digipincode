export type PincodeZone = {
  id: number;
  digits: string;
  circle: string;
};

export const pincodeZones: PincodeZone[] = [
  { id: 1, digits: '11', circle: 'Delhi' },
  { id: 2, digits: '12 - 13', circle: 'Haryana' },
  { id: 3, digits: '14 - 16', circle: 'Punjab' },
  { id: 4, digits: '17', circle: 'Himachal Pradesh' },
  { id: 5, digits: '18 - 19', circle: 'Jammu & Kashmir' },
  { id: 6, digits: '20 - 28', circle: 'Uttar Pradesh' },
  { id: 7, digits: '30 - 34', circle: 'Rajasthan' },
  { id: 8, digits: '36 - 39', circle: 'Gujarat' },
  { id: 9, digits: '40 - 44', circle: 'Maharashtra' },
  { id: 10, digits: '45 - 48', circle: 'Madhya Pradesh' },
  { id: 11, digits: '49', circle: 'Chhattisgarh' },
  { id: 12, digits: '50 - 53', circle: 'Andhra Pradesh' },
  { id: 13, digits: '50 - 53', circle: 'TELANGANA' },
  { id: 14, digits: '56 - 59', circle: 'Karnataka' },
  { id: 15, digits: '60 - 64', circle: 'Tamil Nadu' },
  { id: 16, digits: '67 - 69', circle: 'Kerala' },
  { id: 17, digits: '682', circle: 'Lakshadweep' },
  { id: 18, digits: '70 - 74', circle: 'West Bengal' },
  { id: 19, digits: '744', circle: 'Andaman & Nicobar' },
  { id: 20, digits: '75 - 77', circle: 'Orissa' },
  { id: 21, digits: '78', circle: 'Assam' },
  { id: 22, digits: '79', circle: 'Arunachal Pradesh' },
  { id: 23, digits: '79', circle: 'Manipur' },
  { id: 24, digits: '79', circle: 'Meghalaya' },
  { id: 25, digits: '79', circle: 'Mizoram' },
  { id: 26, digits: '79', circle: 'Nagaland' },
  { id: 27, digits: '79', circle: 'Tripura' },
  { id: 28, digits: '80 - 85', circle: 'Bihar' },
  { id: 29, digits: '80 - 83, 92', circle: 'Jharkhand' },
];
