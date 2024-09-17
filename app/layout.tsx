import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
export const metadata: Metadata = {
	title: "job tracking",
	description: "Track all your job applications",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body>
					<Providers>{children}</Providers>
				</body>
			</html>
		</ClerkProvider>
	);
}
