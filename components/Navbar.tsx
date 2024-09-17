import ThemeToggle from "./ThemeToggle";
import LinksDropdown from "./LinksDropdown";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
	return (
		<nav className="bg-muted flex px-4 justify-between sm:px-12 md:px-16 lg:px-24 py-4">
			<div>
				<LinksDropdown />
			</div>
			<div className="flex items-center gap-x-4">
				<ThemeToggle />
				<UserButton />
			</div>
		</nav>
	);
};

export default Navbar;
