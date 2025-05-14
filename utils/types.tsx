import * as z from 'zod';

export type JobType = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	clerkId: string;
	position: string;
	company: string;
	location: string;
	status: string;
	mode: string;
};

// Enums in TypeScript are a special type that allows you to define a set of named constants. They can be numeric or string-based.

export enum JobStatus {
	Pending = 'Pending',
	Interview = 'Interview',
	Declined = 'Declined',
	Accepted = 'Accepted',
	Offer = 'Offer'
}

export enum JobMode {
	FullTime = 'Full-time',
	PartTime = 'Part-time',
	Internship = 'Internship',
	Remote = 'Remote',
	Hybrid = 'Hybrid',
	Contract = 'Contract'
}

export const createAndEditJobSchema = z.object({
	position: z.string().min(2, {
		message: 'Position must be at least 2 characters.'
	}),
	company: z.string().min(2, {
		message: 'Company must be at least 2 characters.'
	}),
	location: z.string().min(2, {
		message: 'Location must be at least 2 characters.'
	}),
	status: z.nativeEnum(JobStatus),
	mode: z.nativeEnum(JobMode)
});

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>;
