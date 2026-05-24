
import type { Metadata } from 'next';
import { ContactClientPage } from './contact-client-page';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the digi-pincode team. We welcome your questions, feedback, and inquiries. Find our contact details here.',
};

export default function ContactPage() {
  return <ContactClientPage />;
}
