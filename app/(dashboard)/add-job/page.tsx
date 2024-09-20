import CreateJobForm from "@/components/CreateJobForm";

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

const AddJobsPage = () => {
	const queryClient = new QueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CreateJobForm></CreateJobForm>
		</HydrationBoundary>
	);
};
export default AddJobsPage;
