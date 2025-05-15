import { StatsLoadingCard } from '@/components/StatsCard';

function loading() {
	return (
		<div className='grid md:grid-cols-2 gap-4 lg:grid-cols-5'>
			<StatsLoadingCard />
			<StatsLoadingCard />
			<StatsLoadingCard />
			<StatsLoadingCard />
			<StatsLoadingCard />
		</div>
	);
}
export default loading;
