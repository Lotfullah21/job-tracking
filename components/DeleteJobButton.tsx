// "use client";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteJobAction } from "@/utils/actions";

import { useToast } from "@/hooks/use-toast";

const DeleteJobButton = ({ id }: { id: string }) => {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: (id: string) => {
			return deleteJobAction(id);
		},
		onSuccess: (data) => {
			if (!data) {
				toast({
					description: "there was an error",
				});
				return;
			}
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
			queryClient.invalidateQueries({ queryKey: ["stats"] });
			queryClient.invalidateQueries({ queryKey: ["charts"] });
			// Force refetch after invalidation
			toast({ description: "job removed" });
		},
	});

	return (
		<Button size="sm" onClick={() => mutate(id)} disabled={isPending}>
			{isPending ? "deleting..." : "delete"}
		</Button>
	);
};
export default DeleteJobButton;
