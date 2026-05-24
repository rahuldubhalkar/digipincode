
import type { Metadata } from 'next';
import { PrivacyPolicyClientPage } from './privacy-policy-client-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the privacy policy for digi-pincode. We are committed to protecting your privacy and handling your data responsibly.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientPage />;
}
