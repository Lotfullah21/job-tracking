import Link from "next/link";
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
	CardFooter,
} from "./ui/card";
import { JobType } from "@/utils/types";
import { MapPin, Briefcase, CalendarDays, RadioTower } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import DeleteJobBtn from "./DeleteJobButton";
import JobInfo from "./JobInfo";

const JobCard = ({ job }: { job: JobType }) => {
	const date = new Date(job.createdAt).toLocaleDateString();
	return (
		<Card className="bg-muted">
			<CardHeader>
				<CardTitle>{job.position}</CardTitle>
				<CardDescription>{job.company}</CardDescription>
			</CardHeader>
			<Separator></Separator>
			<CardContent className="mt-4 grid grid-cols-2 gap-4">
				<JobInfo icon={<Briefcase />} text={job.mode}></JobInfo>
				<JobInfo icon={<MapPin />} text={job.location}></JobInfo>
				<JobInfo icon={<CalendarDays />} text={date}></JobInfo>
				<Badge className="w-32 justify-center">
					<JobInfo
						icon={<RadioTower className="w-4 h-4" />}
						text={job.status}></JobInfo>
				</Badge>
			</CardContent>
			<CardFooter className="flex gap-4">
				<Button asChild size="sm">
					<Link href={`/jobs/${job.id}`}>edit</Link>
				</Button>
				<DeleteJobBtn id={job.id}></DeleteJobBtn>
			</CardFooter>
		</Card>
	);
};
export default JobCard;
