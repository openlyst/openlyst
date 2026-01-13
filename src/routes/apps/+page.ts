import { getActiveApps } from '$lib/services/dataService';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const apps = await getActiveApps();
  
  return {
    apps
  };
};