
import type { Metadata } from 'next';
import { UpPostalCalendar2026ClientPage } from './up-postal-calendar-2026-client-page';

const articleInfo = {
    title: "Postal Calendar 2026 - UP Circle",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `View the official Postal Calendar for 2026 for the Uttar Pradesh (UP) Circle.`,
};

export default function UpPostalCalendar2026Page() {
    return <UpPostalCalendar2026ClientPage />;
}
