import * as z from "zod";

// for database usage.
export type JobType = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	clerkId: string;
	position: string;
	company: string;
	status: string;
	location: string;
	mode: string;
};

// To add a fixed predefined values
export enum JobStatus {
	Pending = "Pending",
	Interview = "interview",
	Declined = "declined",
}

// To add a predefined fixed values, values apart from values defined here cannot be used, useful when we are having a drop down menu.
export enum JobMode {
	FullTime = "full-time",
	PartTime = "part-time",
	Internship = "internship",
}

// to validate against the form values.
export const createAndEditJobSchema = z.object({
	position: z.string().min(2, {
		message: "position must be at least two characters long",
	}),
	company: z.string().min(2, {
		message: "company must be at least two characters long",
	}),
	location: z.string().min(2, {
		message: "location must be at least two characters long",
	}),
	status: z.nativeEnum(JobStatus),
	mode: z.nativeEnum(JobMode),
});

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>;
