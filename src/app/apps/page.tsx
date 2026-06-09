import { getActiveApps, getDeprecatedApps } from '@/lib/services/dataService';
import { AppsPageContent } from '@/components/AppsPageContent';

export const dynamic = 'force-dynamic';

export default async function AppsPage() {
  const [activeApps, deprecatedApps] = await Promise.all([
    getActiveApps(),
    getDeprecatedApps(),
  ]);
  return <AppsPageContent initialApps={[...activeApps, ...deprecatedApps]} />;
}
