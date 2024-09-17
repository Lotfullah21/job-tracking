"use client";

import Logo from "@/assets/logo.svg";
import { NavLinks } from "@/utils/links";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { linkSync } from "fs";

const Sidebar = () => {
	const pathName = usePathname();

	return (
		<aside className="py-6 px-12 bg-muted h-full ">
			<Image src={Logo} alt="logo"></Image>
			<div className="flex flex-col mt-20 gap-y-4">
				{NavLinks.map((link) => {
					return (
						<Button
							asChild
							key={link.href}
							variant={pathName === link.href ? "default" : "link"}>
							<Link href={link.href} className="flex items-center gap-x-4">
								{link.icon} <span className="capitalize">{link.label}</span>
							</Link>
						</Button>
					);
				})}
			</div>
		</aside>
	);
};
export default Sidebar;
