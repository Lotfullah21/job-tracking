"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { createAndEditJobSchema } from "@/utils/types";
import { CreateAndEditJobType, JobMode, JobStatus } from "@/utils/types";
import { Form } from "./ui/form";
import { CustomFormField, CustomFormSelect } from "./FormComponents";

// Define the form
const CreateJobForm = () => {
	const formProps = useForm<CreateAndEditJobType>({
		// It is responsible for validation.
		resolver: zodResolver(createAndEditJobSchema),
		defaultValues: {
			// Since we are setting up everything as controlled inputs, we need to have default values.
			position: "",
			company: "",
			location: "",
			status: JobStatus.Pending,
			mode: JobMode.FullTime,
		},
	});

	const onSubmit = (values: CreateAndEditJobType) => {
		console.log(values);
	};

	return (
		<Form {...formProps}>
			<form onSubmit={formProps.handleSubmit(onSubmit)} className="p-8 rounded">
				<h2 className="capitalize font-semibold text-4xl mb-6">add job</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
					<CustomFormField
						name="position"
						control={formProps.control}></CustomFormField>
					<CustomFormField
						name="company"
						control={formProps.control}></CustomFormField>
					<CustomFormField
						name="location"
						control={formProps.control}></CustomFormField>
					{/* Job status */}
					<CustomFormSelect
						name="status"
						control={formProps.control}
						labelText="job status"
						items={Object.values(JobStatus)}></CustomFormSelect>
					{/* Job mode */}
					<CustomFormSelect
						name="mode"
						control={formProps.control}
						labelText="job mode"
						items={Object.values(JobMode)}></CustomFormSelect>
					<Button type="submit" className="capitalize self-end">
						add job
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default CreateJobForm;
