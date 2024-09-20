"use client";

import { useSearchParams } from "next/navigation";
import { getAllJobsAction } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import JobCard from "./JobCard";

const JobsList = () => {
	const searchParams = useSearchParams();
	const search = searchParams.get("search") || "";
	const jobStatus = searchParams.get("jobStatus") || "";
	// Get the page number if exists and convert to a number
	const pageNumber = Number(searchParams.get("page")) || 1;

	const { data, isPending } = useQuery({
		// To refetch the data every time one of these params changes
		queryKey: ["all", search, jobStatus, pageNumber],
		queryFn: () => {
			// to query the database based on theses params
			return getAllJobsAction({ search, jobStatus, page: pageNumber });
		},
	});

	const jobs = data?.jobs || [];

	if (isPending) {
		return <h1 className="text-xl">Please wait...</h1>;
	}
	if (jobs.length < 1) {
		return <h1 className="text-xl">No jobs found</h1>;
	}

	return (
		<>
			{/* pagination button container */}
			<div className="grid md:grid-cols-2 gap-8">
				{jobs.map((job) => {
					return <JobCard key={job.id} job={job}></JobCard>;
				})}
			</div>
		</>
	);
};
export default JobsList;