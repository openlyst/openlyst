import { getActiveApps } from '@/lib/services/dataService';
import { AppsPageContent } from '@/components/AppsPageContent';

export const dynamic = 'force-dynamic';

export default async function AppsPage() {
  const apps = await getActiveApps();
  return <AppsPageContent initialApps={apps} />;
}
