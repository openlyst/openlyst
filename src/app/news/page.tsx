import { getAllNews } from '@/lib/services/dataService';
import { NewsPageContent } from '@/components/NewsPageContent';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const news = await getAllNews();
  return <NewsPageContent initialNews={news} />;
}
