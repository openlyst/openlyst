import { getAllApps } from '$lib/utils/repo';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const apps = await getAllApps();
  
  return {
    apps
  };
};