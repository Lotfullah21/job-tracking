import { AreaChart, Layers, AppWindow } from "lucide-react";

type NavLink = {
	href: string;
	label: string;
	icon: React.ReactNode;
};

export const NavLinks: NavLink[] = [
	{
		href: "/add-job",
		label: "add job",
		icon: <Layers></Layers>,
	},
	{
		href: "/jobs",
		label: "jobs",
		icon: <AreaChart></AreaChart>,
	},
	{
		href: "/stats",
		label: "stats",
		icon: <AppWindow></AppWindow>,
	},
];
