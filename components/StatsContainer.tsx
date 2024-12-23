"use client";
import { useQuery } from "@tanstack/react-query";
import { getStatsAction } from "@/utils/actions";

import StatsCard from "./StatsCard";

const StatsContainer = () => {
	const { data } = useQuery({
		queryKey: ["stats"],
		queryFn: () => getStatsAction(),
	});

	return (
		<div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
			<StatsCard title="pending jobs" value={data?.pending || 0}></StatsCard>
			<StatsCard
				title="interview jobs"
				value={data?.interview || 0}></StatsCard>
			<StatsCard title="declined jobs" value={data?.declined || 0}></StatsCard>
		</div>
	);
};

export default StatsContainer;
