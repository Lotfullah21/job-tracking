import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "./ui/dropdown-menu";

import { NavLinks } from "@/utils/links";
import Link from "next/link";
import { Button } from "./ui/button";
import { AlignLeft } from "lucide-react";

const LinksDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="lg:hidden">
				<Button variant="outline" size="icon" className="text-primary">
					<AlignLeft></AlignLeft>
					{/* <span className="sr-only">Toggle links</span> */}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-52 lg:hidden"
				align="start"
				sideOffset={25}>
				{NavLinks.map((link) => {
					return (
						<DropdownMenuItem key={link.href}>
							<Link href={link.href} className="flex gap-x-4 items-center">
								{link.icon} <span className="capitalize">{link.label}</span>
							</Link>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default LinksDropdown;
