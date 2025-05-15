import React from 'react';
import { getStatsAction, getChartsDataAction } from '@/utils/actions';

const StatsPage = async () => {
	const stats = await getStatsAction();
	const charts = await getChartsDataAction();

	return <h1 className='text-4xl'>Stats Page</h1>;
};

export default StatsPage;
