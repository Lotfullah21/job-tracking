"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectTrigger,
	SelectItem,
	SelectContent,
	SelectValue,
} from "./ui/select";
import { JobStatus } from "@/utils/types";
import React from "react";

const SearchForm = () => {
	const searchParams = useSearchParams();
	const search = searchParams.get("search") || "";
	const jobStatusParam = searchParams.get("jobStatus") || "all";
	const router = useRouter();
	const pathname = usePathname();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const searchVal = formData.get("search") as string;
		const jobStatusVal = formData.get("jobStatus") as string;
		// lets construct a new url with search params using URLSearchParams
		const params = new URLSearchParams();
		params.set("search", searchVal);
		params.set("jobStatus", jobStatusVal);
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-muted mb-16 p-8 grid sm:grid-cols-2 md:grid-cols-3  gap-4 rounded-lg">
			<Input
				type="text"
				placeholder="Search Jobs"
				className="border-gray-600"
				defaultValue={search}
				name="search"
			/>
			<Select name="jobStatus" defaultValue={jobStatusParam}>
				<SelectTrigger className="border-gray-600">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{["all", ...Object.values(JobStatus)].map((jobStatus) => {
						return (
							<SelectItem key={jobStatus} value={jobStatus}>
								{jobStatus}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
			<Button type="submit">Search</Button>
		</form>
	);
};
export default SearchForm;
