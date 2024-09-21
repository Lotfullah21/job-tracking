"use client";
import { useSearchParams } from "next/navigation";
import { getAllJobsAction } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import JobCard from "./JobCard";
import ComplexButtonContainer from "./ComplexButtonContainer";

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
	const count = data?.count || 0;
	const totalPages = data?.totalPages || 0;
	const page = data?.page || 0;

	if (isPending) {
		return <h1 className="text-xl mt-12 text-center">Please wait...</h1>;
	}
	if (jobs.length < 1) {
		return <h1 className="text-xl mt-12 text-center">No jobs found</h1>;
	}

	return (
		<>
			<div className="flex items-center justify-between mb-12">
				<h2 className="capitalize text-xl font-bold">{count} jobs found</h2>
				{totalPages > 2 ? (
					<ComplexButtonContainer
						currentPage={page}
						totalPages={totalPages}></ComplexButtonContainer>
				) : null}
			</div>
			<div className="grid md:grid-cols-2 gap-8">
				{jobs.map((job) => {
					return <JobCard key={job.id} job={job}></JobCard>;
				})}
			</div>
		</>
	);
};
export default JobsList;
