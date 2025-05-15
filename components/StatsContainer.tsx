'use client';
import { useQuery } from '@tanstack/react-query';
import { getStatsAction } from '@/utils/actions';
import StatsCard from './StatsCard';

function StatsContainer() {
	const { data } = useQuery({
		queryKey: ['stats'],
		queryFn: () => getStatsAction()
	});

	return (
		<div className='grid md:grid-cols-2 gap-4 lg:grid-cols-5'>
			<StatsCard title='pending jobs' value={data?.Pending || 0} />
			<StatsCard title='interviews set' value={data?.Interview || 0} />
			<StatsCard title='jobs declined' value={data?.Declined || 0} />
			<StatsCard title='jobs accepted' value={data?.Accepted || 0} />
			<StatsCard title='job offers' value={data?.Offer || 0} />
		</div>
	);
}
export default StatsContainer;
