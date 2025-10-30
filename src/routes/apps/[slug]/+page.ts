import { error } from '@sveltejs/kit';
import { getApp } from '$lib/utils/repo';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const app = await getApp(params.slug);
  
  if (!app) {
    throw error(404, 'App not found');
  }
  
  return {
    app
  };
};