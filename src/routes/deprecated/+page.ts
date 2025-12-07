import { getDeprecatedApps } from '$lib/utils/repo';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const apps = await getDeprecatedApps();
  
  return {
    apps
  };
};
