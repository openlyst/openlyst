import { getDeprecatedApps } from '@/lib/services/dataService';
import { DeprecatedPageContent } from '@/components/DeprecatedPageContent';

export const dynamic = 'force-dynamic';

export default async function DeprecatedPage() {
  const apps = await getDeprecatedApps();
  return <DeprecatedPageContent initialApps={apps} />;
}
