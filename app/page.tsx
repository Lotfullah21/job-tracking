import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logoImg from "../assets/logo.svg";
import landingImg from "../assets/main.svg";

export default function Home() {
	return (
		<main>
			<header className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
				<Image src={logoImg} alt="logo "></Image>
			</header>
			<section className="max-w-7xl mx-auto px-4 sm:px-8 h-[94vh] -mt-20 grid lg:grid-cols-[1fr,500px] items-center">
				<div>
					<h1 className="capitalize text-4xl md:text-7xl font-bold">
						job <span className="text-primary">tracking</span> app
					</h1>
					<p className="leading-loose max-w-md mt-4">
						Track your job applications effortlessly with our job tracking app.
						Manage interviews, resumes, and job offers, all in one place,
						helping you stay organized and boost your productivity.
					</p>
					<Button asChild className="mt-4">
						<Link href="/add-job">Get Started</Link>
					</Button>
				</div>
				<Image
					src={landingImg}
					alt="landing"
					className="hidden lg:block ml-4dd"></Image>
			</section>
		</main>
	);
}
