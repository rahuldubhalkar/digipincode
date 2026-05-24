
import type { Metadata } from 'next';
import { DreamAppUpdateClientPage } from './dream-app-update-client-page';

const articleInfo = {
    title: "Ensuring Upgradation of DREAM App to Version 1.0.28 on all MDM Controlled Devices",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Information regarding the mandatory upgrade of the DREAM App to version 1.0.28 on all MDM controlled devices.`,
};

export default function DreamAppUpdatePage() {
    return <DreamAppUpdateClientPage />;
}
