export type PostOffice = {
  OfficeName: string;
  Pincode: string;
  OfficeType: string;
  Delivery: string;
  District: string;
  StateName: string;
  Region: string;
  Circle: string;
  Division: string;
  // Taluk is no longer in the new data
  // Latitude and Longitude are available but not used in the UI yet.
};
