import JobsList from "@/components/JobsList";
import SearchForm from "@/components/SearchForm";
import {
	QueryClient,
	HydrationBoundary,
	dehydrate,
} from "@tanstack/react-query";
import { getAllJobsAction } from "@/utils/actions";

const JobsPage = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["jobs", "all", "", 1],
		queryFn: () => getAllJobsAction({}),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SearchForm></SearchForm>
			<JobsList></JobsList>
		</HydrationBoundary>
	);
};
export default JobsPage;
