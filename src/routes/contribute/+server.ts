import { redirect } from '@sveltejs/kit';

export const GET = () => {
	throw redirect(308, 'https://gitlab.com/Openlyst/');
};
