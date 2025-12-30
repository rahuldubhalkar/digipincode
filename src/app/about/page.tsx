
import type { Metadata } from "next";
import { AboutClientPage } from './about-client-page';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about digi-pincode, your one-stop solution for finding postal information across India, including pincodes, postal codes, and post office details.',
};

export default function AboutPage() {
  return <AboutClientPage />;
}
