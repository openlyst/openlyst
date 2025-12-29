import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllApps, nameToSlug, resolveAppUrls } from '$lib/utils/repo';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const query = url.searchParams.get('q');
    
    if (!query || query.trim().length === 0) {
      return json({ success: false, error: 'Search query is required' }, { status: 400 });
    }
    
    const searchTerm = query.toLowerCase().trim();
    const allApps = await getAllApps();
    
    // Search in app name, subtitle, and description
    const results = allApps.filter(app => 
      app.name.toLowerCase().includes(searchTerm) ||
      app.subtitle.toLowerCase().includes(searchTerm) ||
      app.localizedDescription.toLowerCase().includes(searchTerm) ||
      (app.bundleIdentifier && app.bundleIdentifier.toLowerCase().includes(searchTerm))
    );
    
    // Transform results to include slug, resolve URLs, and calculate relevance score
    const transformedResults = results.map(app => {
      // Calculate simple relevance score
      let score = 0;
      if (app.name.toLowerCase().includes(searchTerm)) score += 10;
      if (app.name.toLowerCase() === searchTerm) score += 20;
      if (app.subtitle.toLowerCase().includes(searchTerm)) score += 5;
      if (app.localizedDescription.toLowerCase().includes(searchTerm)) score += 1;
      
      return {
        ...resolveAppUrls(app),
        slug: nameToSlug(app.name),
        relevanceScore: score
      };
    });
    
    // Sort by relevance score
    transformedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return json({
      success: true,
      query: query,
      count: transformedResults.length,
      data: transformedResults
    });
  } catch (error) {
    return json({ success: false, error: 'Search failed' }, { status: 500 });
  }
};
