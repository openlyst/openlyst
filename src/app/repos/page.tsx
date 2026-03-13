import { getReposByLang } from '@/lib/services/dataService';
import { ReposContent } from '@/components/ReposContent';

export const dynamic = 'force-dynamic';

export default async function ReposPage() {
  const reposByLang = await getReposByLang();
  return <ReposContent reposByLang={reposByLang} />;
}
