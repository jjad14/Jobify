'use client';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAllJobsAction } from '@/utils/actions';
import JobCard from './JobCard';
import ButtonContainer from './ButtonContainer';
import AltButtonContainer from './AltButtonContainer';

function JobsList() {
	const searchParams = useSearchParams();

	const search = searchParams.get('search') || '';
	const jobStatus = searchParams.get('jobStatus') || 'All';

	const pageNumber = Number(searchParams.get('page')) || 1;

	// fetch jobs
	const { data, isPending } = useQuery({
		queryKey: ['jobs', search ?? '', jobStatus, pageNumber],
		queryFn: () => getAllJobsAction({ search, jobStatus, page: pageNumber })
	});
	const jobs = data?.jobs || [];
	const count = data?.count || 0;
	const page = data?.page || 0;
	const totalPages = data?.totalPages || 0;

	if (isPending) return <h2 className='text-xl'>Please Wait...</h2>;

	if (jobs.length < 1) return <h2 className='text-xl'>No Jobs Found...</h2>;

	return (
		<>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-xl font-semibold capitalize '>
					{count} Jobs Found
				</h2>
				{totalPages < 2 ? null : (
					// <ButtonContainer
					// 	currentPage={page}
					// 	totalPages={totalPages}
					// />
					<AltButtonContainer
						currentPage={page}
						totalPages={totalPages}
					/>
				)}
			</div>

			{/*button container  */}
			<div className='grid md:grid-cols-2 gap-8'>
				{jobs.map((job) => {
					return <JobCard key={job.id} job={job} />;
				})}
			</div>

			<div className='flex items-center justify-center mt-3 text-lg'>
				Page {page} of {totalPages}
			</div>
		</>
	);
}
export default JobsList;
