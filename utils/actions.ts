"use server";

import prisma from "./db";
// to get clerk id
import { auth } from "@clerk/nextjs/server";
import { JobType, createAndEditJobSchema, CreateAndEditJobType } from "./types";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import JobsPage from "@/app/(dashboard)/jobs/page";
import { use } from "react";

const authenticateAndRedirect = (): string => {
	const { userId } = auth();
	if (!userId) {
		redirect("/");
	}
	return userId;
};

// To understand what type to use, look where do you use the function and what parameters are expected.
export const createJobAction = async (
	values: CreateAndEditJobType
): Promise<JobType | null> => {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	const userId = authenticateAndRedirect();
	try {
		// validate the values against the schema
		createAndEditJobSchema.parse(values);
		const job: JobType = await prisma.job.create({
			data: {
				...values,
				clerkId: userId,
			},
		});
		return job;
	} catch (error) {
		console.log(error);
		return null;
	}
};

type getAllJobsActionType = {
	search?: string;
	jobStatus?: string;
	page?: number;
	limit?: number;
};

export const getAllJobsAction = async ({
	search,
	jobStatus,
	page = 1,
	limit = 10,
}: getAllJobsActionType): Promise<{
	jobs: JobType[];
	count: number;
	totalPages: number;
	page: number;
}> => {
	const userId = authenticateAndRedirect();
	try {
		let whereClause: Prisma.JobWhereInput = {
			clerkId: userId,
		};

		if (search) {
			// Create a new where clause
			whereClause = {
				...whereClause,
				OR: [
					{
						position: {
							contains: search,
						},
					},
					{
						company: {
							contains: search,
						},
					},
				],
			};
		}

		const skip: number = (page - 1) * limit;

		if (jobStatus && jobStatus !== "all") {
			whereClause = {
				...whereClause,
				status: jobStatus,
			};
		}

		const jobs: JobType[] = await prisma.job.findMany({
			where: whereClause,
			take: limit,
			orderBy: {
				createdAt: "desc",
			},
		});
		const count: number = await prisma.job.count({
			where: whereClause,
		});

		const totalPages = Math.ceil(count / limit);

		return { jobs, count, totalPages, page };
	} catch (error) {
		return { jobs: [], count: 0, totalPages: 0, page: 1 };
	}
};

// Delete Job
export const deleteJobAction = async (id: string): Promise<JobType | null> => {
	const userId = authenticateAndRedirect();
	try {
		const job: JobType = await prisma.job.delete({
			where: {
				id,
				clerkId: userId,
			},
		});
		return job;
	} catch (error) {
		return null;
	}
};

// Find the single job with the specific id.
export const getSingleJobAction = async (
	id: string
): Promise<JobType | null> => {
	let job: JobType | null = null;
	const userId = authenticateAndRedirect();
	try {
		job = await prisma.job.findUnique({
			where: {
				id,
				clerkId: userId,
			},
		});
	} catch (error) {
		job = null;
	}
	if (!job) {
		redirect("/jobs");
	}
	return job;
};

// update the job

export const updateJobAction = async (
	id: string,
	values: CreateAndEditJobType
): Promise<JobType | null> => {
	const userId = authenticateAndRedirect();
	try {
		const job: JobType = await prisma.job.update({
			where: {
				id,
				clerkId: userId,
			},
			data: {
				...values,
			},
		});
		return job;
	} catch (error) {
		return null;
	}
};

export const getStatsAction = async (): Promise<{
	pending: number;
	interview: number;
	declined: number;
}> => {
	const userId = authenticateAndRedirect();
	try {
		const stats = await prisma.job.groupBy({
			where: {
				clerkId: userId,
			},
			by: ["status"],
			_count: {
				status: true,
			},
		});
		const statsObject = stats.reduce((acc, curr) => {
			acc[curr.status] = curr._count.status;
			return acc;
		}, {} as Record<string, number>);
		const defaultStats = {
			pending: 0,
			declined: 0,
			interview: 0,
			...statsObject,
		};
		return defaultStats;
	} catch (error) {
		console.log(error);
		redirect("/jobs");
	}
};

export async function getChartsDataAction(): Promise<
	Array<{ date: string; count: number }>
> {
	const userId = authenticateAndRedirect();
	const sixMonthsAgo = dayjs().subtract(6, "month").toDate();
	try {
		const jobs = await prisma.job.findMany({
			where: {
				clerkId: userId,
				createdAt: {
					gte: sixMonthsAgo,
				},
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		let applicationsPerMonth = jobs.reduce((acc, job) => {
			const date = dayjs(job.createdAt).format("MMM YY");

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
		redirect("/jobs");
	}
}
