import { getChartsDataAction, getStatsAction } from "@/utils/actions";
import ChartsContainer from "@/components/ChartsContainer";
import StatsContainer from "@/components/StatsContainer";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

const StatsPage = async () => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["stats"],
		queryFn: () => getStatsAction(),
	});
	await queryClient.prefetchQuery({
		queryKey: ["charts"],
		queryFn: () => getChartsDataAction(),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<StatsContainer></StatsContainer>
			<ChartsContainer></ChartsContainer>
		</HydrationBoundary>
	);
};

export default StatsPage;
