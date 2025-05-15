'use server';

import prisma from './db';
import { auth } from '@clerk/nextjs';
import { JobType, CreateAndEditJobType, createAndEditJobSchema } from './types';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

function authenticateAndRedirect(): string {
	const { userId } = auth();
	if (!userId) {
		redirect('/');
	}
	return userId;
}

export async function createJobAction(
	values: CreateAndEditJobType
): Promise<JobType | null> {
	// For development
	// await new Promise((resolve) => setTimeout(resolve, 3000));
	const userId = authenticateAndRedirect();
	try {
		// Before creating the job, parse the values using createAndEditJobSchema for server-side validation
		createAndEditJobSchema.parse(values);
		const job: JobType = await prisma.job.create({
			data: {
				...values,
				clerkId: userId
			}
		});
		return job;
	} catch (error) {
		console.error(error);
		return null;
	}
}

type GetAllJobsActionTypes = {
	search?: string;
	jobStatus?: string;
	page?: number;
	limit?: number;
};

export async function getAllJobsAction({
	search,
	jobStatus,
	page = 1,
	limit = 10
}: GetAllJobsActionTypes): Promise<{
	jobs: JobType[];
	count: number;
	page: number;
	totalPages: number;
}> {
	// Grab the current user's id
	const userId = authenticateAndRedirect();

	try {
		// Build the whereClause
		let whereClause: Prisma.JobWhereInput = {
			clerkId: userId
		};

		// If search is provided, add it to the whereClause, where search is a substring of position or company
		if (search) {
			whereClause = {
				...whereClause,
				OR: [
					{
						position: {
							contains: search
						}
					},
					{
						company: {
							contains: search
						}
					}
				]
			};
		}

		// If jobStatus is provided, add it to the whereClause
		if (jobStatus && jobStatus !== 'All') {
			whereClause = {
				...whereClause,
				status: jobStatus
			};
		}
		// Calculate the skip value
		const skip = (page - 1) * limit;

		// Query the database with the whereClause and orderBy filter to retrieve list of jobs
		const jobs: JobType[] = await prisma.job.findMany({
			where: whereClause,
			skip,
			take: limit,
			orderBy: {
				createdAt: 'desc'
			}
		});

		// Count the total number of jobs
		const count: number = await prisma.job.count({
			where: whereClause
		});

		// Calculate the total number of pages
		const totalPages = Math.ceil(count / limit);

		return { jobs, count, page, totalPages };
	} catch (error) {
		console.error(error);
		return { jobs: [], count: 0, page: 1, totalPages: 0 };
	}
}

export async function deleteJobAction(id: string): Promise<JobType | null> {
	const userId = authenticateAndRedirect();

	try {
		const job: JobType = await prisma.job.delete({
			where: {
				id,
				clerkId: userId
			}
		});
		return job;
	} catch (error) {
		return null;
	}
}

export async function getSingleJobAction(id: string): Promise<JobType | null> {
	let job: JobType | null = null;
	const userId = authenticateAndRedirect();

	try {
		job = await prisma.job.findUnique({
			where: {
				id,
				clerkId: userId
			}
		});
	} catch (error) {
		job = null;
	}

	// If no job is found, redirect to the jobs page
	if (!job) {
		redirect('/jobs');
	}
	return job;
}

export async function updateJobAction(
	id: string,
	values: CreateAndEditJobType
): Promise<JobType | null> {
	const userId = authenticateAndRedirect();

	try {
		const job: JobType = await prisma.job.update({
			where: {
				id,
				clerkId: userId
			},
			data: {
				...values
			}
		});
		return job;
	} catch (error) {
		return null;
	}
}

export async function getStatsAction(): Promise<{
	Pending: number;
	Interview: number;
	Declined: number;
	Accepted: number;
	Offer: number;
}> {
	const userId = authenticateAndRedirect();
	// just to show Skeleton
	// await new Promise((resolve) => setTimeout(resolve, 5000));
	try {
		const stats = await prisma.job.groupBy({
			by: ['status'],
			_count: {
				status: true
			},
			where: {
				clerkId: userId // replace userId with the actual clerkId
			}
		});

		const statsObject = stats.reduce((acc, curr) => {
			acc[curr.status] = curr._count.status;
			return acc;
		}, {} as Record<string, number>);

		const defaultStats = {
			Pending: 0,
			Declined: 0,
			Interview: 0,
			Accepted: 0,
			Offer: 0,
			...statsObject
		};
		return defaultStats;
	} catch (error) {
		redirect('/jobs');
	}
}

export async function getChartsDataAction(): Promise<
	Array<{ date: string; count: number }>
> {
	const userId = authenticateAndRedirect();
	const sixMonthsAgo = dayjs().subtract(6, 'month').toDate();
	try {
		const jobs = await prisma.job.findMany({
			where: {
				clerkId: userId,
				createdAt: {
					gte: sixMonthsAgo
				}
			},
			orderBy: {
				createdAt: 'asc'
			}
		});

		let applicationsPerMonth = jobs.reduce((acc, job) => {
			const date = dayjs(job.createdAt).format('MMM YY');

			const existingEntry = acc.find((entry) => entry.date === date);

			if (existingEntry) {
				existingEntry.count += 1;
			} else {
				acc.push({ date, count: 1 });
			}

			return acc;
		}, [] as Array<{ date: string; count: number }>);

		return applicationsPerMonth;
	} catch (error) {
		redirect('/jobs');
	}
}
