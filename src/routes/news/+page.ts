import { getAllNews } from '$lib/services/dataService';

export const load = async () => {
	const news = await getAllNews();
	return { news };
};
