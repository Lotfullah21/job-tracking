import EditJobForm from "@/components/EditJobForm";
import { getSingleJobAction } from "@/utils/actions";

import {
	HydrationBoundary,
	dehydrate,
	QueryClient,
} from "@tanstack/react-query";

const SingleJobPage = async ({ params }: { params: { id: string } }) => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["job", params.id],
		queryFn: () => getSingleJobAction(params.id),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<EditJobForm jobId={params.id}></EditJobForm>
		</HydrationBoundary>
	);
};

export default SingleJobPage;
