import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="grid lg:grid-cols-5">
			{/* Hide sidebar on small screen, sidebar */}
			<div className="hidden lg:block lg:col-span-1 lg:min-h-screen">
				<Sidebar></Sidebar>
			</div>
			{/* for pages */}
			<div className="lg:col-span-4">
				{/* shared across all children */}
				<Navbar></Navbar>
				{/* adding common classes to all pages */}
				<div className="py-16 px-4 sm:px-8 lg:px-16">{children}</div>
			</div>
		</main>
	);
};
export default layout;
