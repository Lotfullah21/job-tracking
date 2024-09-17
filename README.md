npm install @clerk/nextjs@^4.27.7 @prisma/client@^5.7.0 @tanstack/react-query@^5.14.0 @tanstack/react-query-devtools@^5.14.0 dayjs@^1.11.10 next-themes@^0.2.1 recharts@^2.10.3
npm install prisma@^5.7.0 -D

<!-- Just to remove git from our project temporarily if there is any. -->

```sh
rm -rf .git
```

<!-- libraries (packages) to install via npm -->

```sh
npm install @clerk/nextjs @prisma/client @tanstack/react-query dayjs next-themes recharts prisma


```

#### @clerk/nextjs:

Library: This is a library that integrates Clerk's authentication features with Next.js. It provides tools to manage user authentication, sessions, and user data.

#### @prisma/client:

Library: This is the Prisma client, an ORM (Object Relational Mapping) tool that simplifies database queries in JavaScript/TypeScript applications.

#### @tanstack/react-query:

Library: This is React Query, a library that helps with managing and caching server-side state in React apps.

#### dayjs:

Library: This is a lightweight library for working with dates and times in JavaScript, offering an alternative to Moment.js.

#### next-themes:

Library: This library helps manage light and dark themes in Next.js apps, supporting theme persistence based on user preferences or system settings.

#### recharts:

Library: A charting library built with React for creating responsive charts and data visualizations.
prisma:

Library (Prisma CLI): This installs the Prisma CLI, a command-line tool for managing your Prisma schema and database migrations.

# Authentication

## Clerk

Clerk's ClerkR refers to the Clerk Runtime responsible for managing authentication and session state in the browser. Clerk uses browser cookies to store specific information securely to manage authentication and identity for users on the client side.

#### How Clerk Uses Cookies:

`Session Management`: Clerk stores session tokens or identifiers in cookies to keep track of whether a user is logged in. This allows Clerk to maintain the user's session across different pages and requests, even when the user navigates around the site or reloads a page.

`Authentication Tokens`: Clerk may store tokens (e.g., JWTs or session tokens) in cookies to authenticate requests. These tokens are sent along with HTTP requests to the server, allowing the server to verify the user's identity without requiring them to log in again for every request.

`Cross-Site Security`: Clerk ensures cookies are set with appropriate security flags, like HttpOnly and Secure, to prevent unauthorized access from JavaScript and protect them in transit over HTTPS.

`User State`: Clerk uses cookies to track the user's state (e.g., logged in or logged out) and manage transitions between states, ensuring that the user experience is smooth across sessions.

- When a user logs in or out, ClerkR updates the relevant cookies to reflect the user's state.
- On each page load, ClerkR reads the cookies to determine if the user is authenticated and manages session continuation.

## Middleware

Middleware is software or code that sits between two layers of a system and facilitates communication, data processing, or specific functionality.

Here, middleware typically refers to functions that sit between the request and the response in a web application

- Modifying the request or response objects.
- Checking authentication and authorization.
- Logging requests or errors.
- Handling errors or redirects.
- Parsing incoming request data (e.g., JSON or form data).x
- It allows to do something before completion of the request.

In Next.js, middleware is used to run code before a request is processed by the page or API route. For example, you can protect certain routes by checking if the user is authenticated, or you can redirect users based on certain conditions.

- create middleware.ts in the root
- by default it will invoked for every route in our project.

```tsx
export default function king() {
	console.log("Hello from middleware");
}
```

The code inside middleware.ts will be invoked before every single request.

We can define matcher to target specific route for the middleware function.

```ts
export default function king() {
	console.log("Hello from middleware");
	return Response.json({ msg: "Hello from middleware" });
}
export const config = {
	matcher: "/middle",
};
```

We will get the above response only when we visit `/middle` route.

#### Crucial:

Create `middleware.ts` in root directory, not in `/app`, but where `tsconfig.json` lives. extension should be `.ts` and name should be `middleware`

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware((auth, request) => {
	if (!isPublicRoute(request)) {
		auth().protect();
	}
});

// invoke clerkMiddleware for the given paths
export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
```

After configuring your application in clerk, copy the keys and create a file `.env.local` in main directory and add them.

Now, lets wrap entire application around `ClerkProvider`.

```tsx
// layout.tsx in root app

import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
			<html lang="en">
				<body className={`antialiased`}>{children}</body>
			</html>
		</ClerkProvider>
	);
}
```

## Dashboard Layout.

- Divide the main layout into five grid columns.
- Distribute one column to sidebar.

```tsx
<div className="hidden lg:block lg:col-span-1 lg:min-h-screen">
	<Sidebar></Sidebar>
</div>
```

- Distribute remaining columns to the main contents.
- Inject the navbar in pages container.
- Add some common style for children.

```tsx
/* for pages */
<div className="lg:col-span-4">
	{/* shared across all children */}
	<Navbar></Navbar>
	{/* adding common classes to all pages */}
	<div className="py-16 px-4 sm:px-8 lg:px-16">{children}</div>
</div>
```

## Sidebar

#### CSS

`h-full`: take 100% of the parent height.
`min-h-screen`: take 100% of screen height.

When aligning the navbar, once we hide the dropdown menu on large screen, we will be having the user button on left hand side, to shift to the right most side, wrap the dropdown inside a div to have an empty div.

```tsx
<nav className="flex bg-muted justify-between sm:px-12 md:px-16 lg:px-24 py-4">
	<div>
		<LinksDropdown />
	</div>
	<div className="flex items-center gap-x-12">
		<ThemeToggle />
		<UserButton />
	</div>
</nav>
```

## Themes

```sh
npm i next-themes
```

### Set a theme component inside component folder

```tsx
// /component/theme-provider.tsx

"use client";
import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};
export default ThemeProvider;
```

### Wrap the children

Wrap the children inside the theme provider in `provider.tsx` file.

```tsx
// providers.tsx

"use client";
import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};
export default ThemeProvider;
```

### Set the logic inside `/component/ThemeToggle` component.

[theme-setting](https://ui.shadcn.com/docs/dark-mode/next)

```tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from "./ui/dropdown-menu";

interface ThemeToggleProps {
	className?: string; // Optional className prop
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default ThemeToggle;
```

### Crucial

Make sure to remove all the boiler plate code from `.globals.css` except tailwind one and the theme code from shadecn, otherwise when using `bg-muted`, it acts weird and some of those styles gets applied.
# job-tracking
