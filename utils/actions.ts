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
		if (jobStatus && jobStatus !== 'all') {
			whereClause = {
				...whereClause,
				status: jobStatus
			};
		}

		// Query the database with the whereClause and orderBy filter to retrieve list of jobs
		const jobs: JobType[] = await prisma.job.findMany({
			where: whereClause,
			orderBy: {
				createdAt: 'desc'
			}
		});

		return { jobs, count: 0, page: 1, totalPages: 0 };
	} catch (error) {
		console.error(error);
		return { jobs: [], count: 0, page: 1, totalPages: 0 };
	}
}
