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

```tsx
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create a route matcher to differentiate between public and protected route.
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware((auth, request) => {
	// If the request is not part of public route.
	if (!isPublicRoute(request)) {
		//  enforce authentication
		auth().protect();
	}
});

// This matcher ensures the middleware is applied to all routes except for Next.js internals and specific static files. API routes are always protected.
export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
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

## Form components

```sh
npx shadcn@latest add form input
```

## Zod

zod is used for schema validation. zod helps define the structure of form data and enforces rules (e.g., field length, data types).

```tsx
// Define the form
const CreateJobForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		// It is responsible for validation.
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
	});
```

`z.infer`: z.infer is a utility type from the zod library that infers the TypeScript type based on a Zod schema. It helps automatically generate TypeScript types from your Zod validation schema, ensuring that your form values are correctly typed according to the validation rules you defined.

The z.infer<typeof formSchema> tells useForm that the form values should adhere to the structure defined by formSchema. This ensures that if you add more fields to the schema, the TypeScript type will automatically update to match the new structure.

`zodResolver` is a utility from @hookform/resolvers/zod that allows react-hook-form to integrate with zod validation schemas.

`useForm` is the core hook from react-hook-form that manages the form state, validation, and submission handling.

useForm initializes the form with a validation resolver (zodResolver) that uses the formSchema defined earlier.

It also specifies default values for the form fields.

```tsx
const onSubmit = (values: z.infer<typeof formSchema>) => {
	console.log(values);
};
```

This function defines what happens when the form is successfully submitted.

values represents the form data, and it's typed using z.infer<typeof formSchema>, meaning it follows the structure of the formSchema.

```tsx
<Form {...form}>
	<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
		{/* FormField for "username" */}
		<FormField
			control={form.control}
			name="username"
			render={({ field }) => (
				<FormItem>
					<FormLabel>user name</FormLabel>
					<FormControl>
						<Input placeholder="xyx" {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
		{/* Submit Button */}
		<Button type="submit">submit</Button>
	</form>
</Form>
```

`<Form {...form}>`: This wraps the entire form and spreads the form object, which contains methods and data for form handling.

`form.handleSubmit(onSubmit)`: This method is passed to the `<form>` tag to handle form submission and run the validation logic defined earlier.

#### Inside the form

`FormLabel`: Displays the label ("user name") for the username input field.
`FormControl`: Wraps the actual input field (Input), providing styling or additional control logic.
`Input`: This is the actual input element where users can type the username.
`FormMessage` This is where error messages will be shown when the form validation fails. If, for example, the username is too short, the message from zod ("at least two characters are required") will appear here.

##### render={({ field }) => ... }:

The render function in react-hook-form is used inside FormField to handle how a field is displayed and managed. The render prop expects a function, and this function receives an object containing several properties and methods related to the form field.

A function used to render the form field, and it provides the field object.

###### field:

This object contains the methods and properties required to control the input field (e.g., onChange, onBlur, value, name, ref, etc.). It automatically connects the form field to react-hook-form, making it a controlled input.

render: This is a function that is called to "render" the form field's UI. It returns the JSX for the specific form field.
{ field }: Inside this render function, react-hook-form provides an object with field, which contains all the necessary props and methods to control the input element.

The field object is automatically provided by react-hook-form and includes the following properties that are spread onto the <Input /> component:

`onChange`: A function that gets called when the value of the input changes.

`onBlur`: A function that gets called when the input loses focus.

`value`: The current value of the input (synchronized with react-hook-form state).

`name`: The name of the field, used to register the input in react-hook-form.

`ref`: A reference to the input element, used to focus the input or access its DOM node.

The user interacts with the form input (username).
When they try to submit the form, react-hook-form checks the input based on the rules defined in formSchema (in this case, the username must have at least 2 characters).
If the input is valid, the onSubmit function is called.
If the input is invalid, the FormMessage component will display the appropriate error message.

Lets breakdown our components

```tsx
export const CustomFormField = ({ name, control }: CustomFormFieldPropType) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="capitalize">{name}</FormLabel>
					<FormControl>
						<Input {...field}></Input>
					</FormControl>
					<FormMessage></FormMessage>
				</FormItem>
			)}></FormField>
	);
};
```

## Select

```tsx
type CustomFormSelectProps = {
	name: string;
	control: Control<any>;
	items: string[];
	labelText?: string;
};

export const CustomFormSelect = ({
	name,
	control,
	items,
	labelText,
}: CustomFormSelectProps) => {
	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel className="capitalize">{labelText || name}</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue></SelectValue>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{items.map((item) => {
									return (
										<SelectItem key={item} value={item}>
											{item}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
};
```

## Types

### 1. Type Annotation (:):

`Purpose`: It is used to explicitly declare the type of a variable, function parameter, or return value.

`Usage`: Type annotations are written with a colon (:) followed by the type. This ensures that the variable or parameter is treated as that specific type by TypeScript.

`Where it's used`: On function parameters, variables, return types, or properties.

Example:

```tsx
// Variable type annotation
let age: number = 25;

// Function parameter and return type annotation
function greet(name: string): string {
	return `Hello, ${name}`;
}
```

### 2. Generic (<T>):

`Purpose`: It allows a function, class, or component to be flexible and work with various types, without being restricted to a single type. Generics act like placeholders for types and are filled in when the function or class is called.

`Usage`: Generics are declared using angle brackets (<T>, where T is a placeholder for a type). When calling the function or using the class, you can provide a specific type, or TypeScript can infer it automatically.

`Where it's used`: In functions, classes, and interfaces that need to handle multiple types dynamically.

```tsx
// Generic function
function identity<T>(value: T): T {
	return value;
}

// Using the generic function
let result1 = identity<string>("Hello"); // T is string
let result2 = identity<number>(42); // T is number
```

<!-- CreateJobForm -->

```jsx
// Define the form
const CreateJobForm = () => {
	const form =
		useForm <
		CreateAndEditJobType >
		{
			// It is responsible for validation.
			resolver: zodResolver(createAndEditJobSchema),
			defaultValues: {
				// Since we are setting up everything as controlled inputs, we need to have default values.
				position: "",
				company: "",
				location: "",
				status: JobStatus.Pending,
				mode: JobMode.FullTime,
			},
		};

	const onSubmit = (values: CreateAndEditJobType) => {
		console.log(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<Button type="submit">submit</Button>
			</form>
		</Form>
	);
};

export default CreateJobForm;
```

By providing CreateAndEditJobType as the generic type, we're telling TypeScript that the form's data structure will follow the shape defined by CreateAndEditJobType.
In other words, it ensures that the form fields, default values, and submitted values conform to the expected structure defined in CreateAndEditJobType.

When we pass CreateAndEditJobType to useForm, TypeScript knows that:

The form's position field must be a string.
The form's status field must match one of the JobStatus enum values.

useForm<CreateAndEditJobType>() means the useForm hook will manage form data with the structure defined by CreateAndEditJobType. This enforces type safety.

```tsx
<Form {...form}>
	<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
		<Button type="submit">submit</Button>
	</form>
</Form>
```

The `useForm` hook returns an object with several properties and methods for managing form state. Some of the key properties you might use from form include:

`form.handleSubmit(onSubmit)`: This is a method that handles the form submission process, running validation and passing the form values to the onSubmit function when the form is submitted.

`form.register`: Used to register form input fields so that they can be controlled by useForm and tracked in the form state.

`form.errors`: Contains validation errors if any form fields fail to validate.

`form.reset`: Resets the form to its initial values.

`form.control`: Provides access to the form's control object, which is useful for controlled inputs.

#### 1. <Form {...form}>

- The component <Form> (assuming it's a custom component) is being passed the entire form object using the spread operator {...form}.
- This means all the properties and methods inside form (like form.handleSubmit, form.register, etc.) are being passed as props to the <Form> component.

#### 2. `<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">`

- The onSubmit handler for the HTML <form> element is set to form.handleSubmit(onSubmit).
- form.handleSubmit(onSubmit) is a function that will trigger form validation when the form is submitted. If the validation passes, the onSubmit function is called with the validated form values.
- Integrates validation and submission logic
- Function that processes the form data after validation

#### Validation based on what?

It validates based on our schema

### Form Submission:

- When the form is submitted, form.handleSubmit(onSubmit) is called.
  `handleSubmit` triggers the validation process using the schema specified in resolver.
  Validation Process:

- With zodResolver: The zodResolver function takes the schema and applies it to the form data.
  The form data is validated against the schema. If any field fails the validation (e.g., if a required field is empty), an error message is generated.
  Error Handling:

- If validation fails, react-hook-form populates an errors object with details of the validation issues.
  You can access these errors and display them in the UI, typically using form.errors.

## control

```tsx
<CustomFormField name="position" control={formProps.control}></CustomFormField>
```

`form.control`:

control is an object provided by useForm that contains the form's state and methods necessary for managing form fields.
It includes information and methods for form registration, handling form state, and managing form validation.

###### Purpose of control:

The control object allows us to integrate `react-hook-form` with custom form components, such as FormField, FormItem, FormLabel, FormControl, and FormMessage.
It provides the necessary hooks and state management to handle form field values, validation, and errors.
How It Works:

###### Custom Form Components:

FormField is a custom component designed to integrate with react-hook-form. It uses control to interact with the form state and validation.

###### Using control in FormField:

`control={form.control}`: Passes the control object from useForm to FormField.
Inside FormField, control is used to connect the form state and handlers with the custom input components.

`render`: A prop of Controller that defines how the controlled field should be rendered, receiving a field object.

`field`: Contains properties and methods to manage the form field's state, including value, onChange, onBlur, and name.

### FormField

````tsx
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="capitalize">{name}</FormLabel>
					<FormControl>
						<Input {...field}></Input>
					</FormControl>
					<FormMessage></FormMessage>
				</FormItem>
			)}></FormField>```
````

##### `control`:

Type: `Control`
Description: This is the `control` object provided by the useForm hook from react-hook-form. It manages the form's state and validation. You pass this `control` object to FormField so that it can use it to manage the specific form field's state and validation.

##### name:

Type: string
Description: This is the name of the field within the form. It should match the key in the form state object. It helps identify which field's state and validation errors should be managed.

##### render:

Type: (field: FieldValues) => JSX.Element
Description: This is a function that receives the `field` object and returns JSX for rendering the `field`. The `field` object includes properties such as value, onChange, onBlur, and ref, which are necessary for binding the input component to the form state and handling user interactions.

# Database

We will be using render to store our data.

## render

- Create an account.
- Go to new and create a new instance
- Create a new .env file
- add the .evn in .gitignore
- Add the `external link url` to the env file, name of variable should be `DATABASE_URL`.

[render](https://dashboard.render.com/)

# prisma

It helps us to interact with a database.

prisma is an open-source database toolkit designed to make easy database interactions and development. It provides a modern and intuitive way to work with database.

### Prisma Client:

An auto-generated query builder for TypeScript and Node.js. It provides a type-safe API for querying and manipulating your database, making it easier to work with data and reducing the risk of runtime errors.

### Prisma Migrate:

A migration tool that helps you manage and apply changes to your database schema. It allows you to define and version control your schema changes using a declarative syntax and provides commands to apply these changes to your database.

#### Setup

create a new instance of prisma

```sh
npx prisma init
```

### Prisma Studio:

A web-based GUI for exploring and managing your data. It provides a user-friendly interface for viewing, editing, and managing the records in your database.

### Prisma Schema:

A declarative schema definition language that allows you to define your data models and relationships in a single file. The Prisma schema file is used by Prisma to generate the client and manage database migrations.

Prisma Data Platform: A cloud-based platform offering additional features, such as monitoring, insights, and collaboration tools, to enhance the development and management of your database.

creating a model, a model is basically the blue print of our data.

```ssh

model Task  {
id String @id @default(uuid())
content String
createdAt DateTime @default(now())
completer Boolean @default(false)
}


```

After creating the model use the given command to track the changes locally.

```ssh
npx prisma migrate dev
```

## Prisma CRUD operation

### 1. Create

```js
await prisma.task.create({
	data: {
		content: "some task",
	},
});
```

### 2. Read

```js
const allTasks = await prisma.task.findMany({});
// If some format you want
const allTasks = await prisma.task.findMany({
	orderBy: {
		createdAt: "desc",
	},
});
return allTasks;
```

```js
// Getting unique data
const uniqueData = await prisma.task.findUnique({
	where: {
		task: "finish",
	},
});
```

### 3. Update

```js
const updateTask = await prisma.task.update({
	// Grab the item
	where: {
		id: id,
	},
	// What to update
	data: {
		content: "finish in an hour",
	},
});
```

### 4. Delete

```js
const deleteTask = await prisma.task.delete({
	where: { id: id },
});
```

#### Define the schema at `prisma/schema.prisma`

```tsx
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model Job = {
	id String
}


// When a record is created, both createdAt and updatedAt are set to the current time.
// When the record is updated, only the updatedAt field is updated with the new current time.


model Job {
  id String @id @default(uuid())
  clerkId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  position String
  company String
  status String
  location String
  mode String
}
```

#### Setup the database connection

`utils/db.ts`

```tsx
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Now push the prisma changes to the database.

```sh
npx prisma db push
```

Open the studio

```sh
npx prisma studio
```

# Actions

Now, lets write server functions to create the job instances in the database.

- create `utils/actions.ts`

```ts
"use server";

import prisma from "./db";
// to get clerk id
import { auth } from "@clerk/nextjs/server";
import { JobType, createAndEditJobSchema, CreateAndEditJobType } from "./types";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { promise } from "zod";
import { resolve } from "path";

const authenticateAndRedirect = (): string => {
	const { userId } = auth();
	if (!userId) {
		redirect("/");
	}
	return userId;
};

// To understand what type to use, look where do you use the function and what parameters are expected.
export const createJobAction = async (
	values: CreateAndEditJobType
): Promise<JobType | null> => {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	const userId = authenticateAndRedirect();
	try {
		// validate the values against the schema
		createAndEditJobSchema.parse(values);
		const job: JobType = await prisma.job.create({
			data: {
				...values,
				clerkId: userId,
			},
		});
		return job;
	} catch (error) {
		console.log(error);
		return null;
	}
};
```

# React Query and Toast

```sh
 npx shadcn@latest add toast
```

[shadcn-toast-docs](https://ui.shadcn.com/docs/components/toast)

## React Query

React Query simplifies fetching, caching, and updating data by handling much of the complexity for us. The library provides:

`Automatic background refetching`: It refreshes stale data automatically, keeping your app up-to-date.

`Caching`: It caches data and can re-use it, avoiding redundant network requests.

`Error handling`: Automatically detects and handles request errors.

`Improved performance`: It optimizes re-renders and minimizes unnecessary network requests by managing states like isLoading or isStale.

Compared to using useEffect for fetching data, React Query brings:

- A more declarative approach.
- Centralized management for queries.
- Cleaner code with less boilerplate.

[React-Query-Docs](https://tanstack.com/query/v4/docs/framework/react/overview)

A simple example

```tsx
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Example />
		</QueryClientProvider>
	);
}

function Example() {
	const { isLoading, error, data } = useQuery({
		queryKey: ["repoData"],
		queryFn: () =>
			fetch("https://api.github.com/repos/TanStack/query").then((res) =>
				res.json()
			),
	});

	if (isLoading) return "Loading...";

	if (error) return "An error has occurred: " + error.message;

	return (
		<div>
			<h1>{data.name}</h1>
			<p>{data.description}</p>
			<strong>👀 {data.subscribers_count}</strong>{" "}
			<strong>✨ {data.stargazers_count}</strong>{" "}
			<strong>🍴 {data.forks_count}</strong>
		</div>
	);
}
```

## QueryClient

Purpose: The QueryClient is responsible for managing the caching and querying of data in React Query. It holds the configuration and state related to queries and mutations.

```tsx
const [queryClient] = useState(() => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000 * 5,
			},
		},
	});
});
```

`Instance Creation`: You create an instance of QueryClient to configure and provide settings that apply to your queries and mutations.
A `QueryClient` instance manages the configuration, caching, and querying for the application.

`staleTime`: It defines how long fetched data remains "fresh." During this time, React Query won't refetch unless explicitly requested. After the staleTime, the data becomes "stale," allowing refetching if required.

This means that data fetched by a query will be considered fresh for 6 minute before React Query considers it stale and potentially refetches it.

### Why Use staleTime?

`Caching`: By setting a staleTime, you control how often data is refetched, which can improve performance and reduce unnecessary network requests.

`Consistency`: Ensures that your application’s data does not change too frequently, which can be important for user experience and consistency.

## Wrapping entire application around QueryClient

```tsx
export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Example />
		</QueryClientProvider>
	);
}
```

`QueryClientProvider`: A React Query context provider component that makes the QueryClient instance available to all child components via React’s context API.

`client` refers to the QueryClient instance that is responsible for managing the behavior of all queries and mutations in our application. It handles things like caching, background refetching, pagination, and other query-related behaviors.

```tsx
function Example() {
	const { isLoading, error, data } = useQuery({
		queryKey: ["repoData"],
		queryFn: () =>
			fetch("https://api.github.com/repos/TanStack/query").then((res) =>
				res.json()
			),
	});
```

Our data is located inside data property in data object.

Inside useQuery, we will be having {data, isLoading, isError, isFetched, isState} and many more properties.

### Query Key

`queryKey` is a unique identifier that React Query uses to track the data in the cache.

The unique key you provide is used internally for refetching, caching, and sharing your queries throughout your application.

### Query Function

A query function can be literally any function that returns a promise. The promise that is returned should either resolve the data or throw an error.

`queryFn` is the function that returns the fetched data, which can be any function returning a Promise.

### Result

- `data`: The fetched data (from the queryFn).
- `isLoading`: Boolean indicating if the query is still loading.
- `isError`: Boolean indicating an error occurred during the fetch.
- `isFetched`: Tracks if the query has fetched data at least once.
- `isStale`: True if the data is no longer fresh and may be refetched.

#### Why using useState

The reason we often wrap the creation of the QueryClient (or other objects) inside useState is to ensure that it’s created only once per component lifecycle. This is necessary because React components can re-render multiple times, and we don’t want to create a new instance of QueryClient on every render, which could lead to problems like losing the cache or resetting the query state.

By using useState(() => new QueryClient()), React ensures that the QueryClient instance is created once (during the component's initial render) and persists across subsequent re-renders.

The useState hook remembers the created value and returns the same instance every time the component re-renders.

#### Summary:

`React Query` simplifies data fetching, caching, and syncing, compared to manual useEffect and useState setups.

`QueryClient` manages queries, including caching, stale data management, and background refetching.

`StaleTime` allows control over how long data is considered fresh, which optimizes network usage and performance by avoiding unnecessary refetching within a certain period.

`useQuery` is the core hook, providing helpful properties such as data, isLoading, isError, and others to manage the state of your requests in the UI.

`useQuery` manages the data fetching.

### Why Use React Query?

Better performance due to caching and intelligent data refetching.

- `Declarative code`: Handles state changes like loading and error without additional logic.
- `Reduced boilerplate`: You don’t need to write repetitive code for data-fetching and state handling.
- `Automatic retry`: In case of failures, React Query can retry fetching the data, configurable based on your needs.
- `Support for pagination and infinite scrolling`: Great for apps that load large amounts of data.

In next.js if we want to wrap our component, we need to do the following.

```tsx
import CreateJobForm from "@/components/CreateJobForm";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

const AddJobsPage = () => {
	const queryClient = new QueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CreateJobForm></CreateJobForm>
		</HydrationBoundary>
	);
};
export default AddJobsPage;
```

### Infinite scrolling

infinite scrolling is a user interface pattern where content is continuously loaded as the user scrolls down a page, rather than displaying all the content at once or requiring users to click a "Next" or "Load More" button.

Here's how it works:

As the user scrolls down a page and reaches the bottom (or near the bottom), new content is automatically fetched and appended to the current content.
This creates the effect of a never-ending stream of data (e.g., social media feeds, search results, or e-commerce product listings).

### Lets setup the logic in `CreateJobForm`.

Imports:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJobAction } from "@/utils/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import { createAndEditJobSchema } from "@/utils/types";
```

```tsx
const CreateJobForm = () => {
	const formProps = useForm<CreateAndEditJobType>({
		// It is responsible for validation.
		resolver: zodResolver(createAndEditJobSchema),
		defaultValues: {
			// Since we are setting up everything as controlled inputs, we need to have default values.
			position: "",
			company: "",
			location: "",
			status: JobStatus.Pending,
			mode: JobMode.FullTime,
		},
	});

	const queryClient = useQueryClient();
	const { toast } = useToast();
	const router = useRouter();
	const { mutate, isPending } = useMutation({
		mutationFn: (values: CreateAndEditJobType) => createJobAction(values),
	});
};
const onSubmit = (values: CreateAndEditJobType) => {
	mutate(values);
};
```

## useMutation

```jsx
const { mutate, isPending } = useMutation({
	mutationFn: (values: CreateAndEditJobType) => {
		return createJobAction(values);
	},
});
```

useMutation is designed to handle and manage server-side mutations in a React application. Unlike useQuery, which is used for fetching data, useMutation is used for creating, updating, or deleting data (i.e., performing write operations). Here’s why you would use useMutation:

### 1. Handling Server-Side Mutations

Purpose: useMutation is specifically designed to handle operations that change data on the server, such as creating a new record, updating an existing record, or deleting a record.
Example: Submitting a form to create a new user, updating user details, or deleting a post.

### 2. Automatic State Management

Status Tracking: useMutation provides states such as isLoading, isSuccess, isError, and isIdle to track the status of the mutation. This helps in handling loading states, error handling, and post-mutation actions.
Example: Showing a loading spinner while a request is in progress, or displaying a success message once the operation completes.

### 3. Optimistic Updates

Optimistic UI: You can use useMutation to perform optimistic updates where you update the UI before the server responds. This creates a more responsive user experience.
Example: Updating a list immediately when an item is added, even before the server confirms the addition.

### 4. Error Handling

Error Management: useMutation provides a way to handle errors from server-side operations. You can use onError to handle errors and provide feedback to the user.
Example: Showing an error message if the server returns a failure response.

`mutationFn` is a function that takes messages as its argument.

It calls createJobAction(values) and returns its result.

When the form is submitted, the mutate function triggers the mutationFn. The mutationFn will then call the CreateAndEditJobType function, passing the current input (text) as the argument.

## Invalidate

Mark the data as stale.

invalidating queries means marking them as "stale" so that they are refetched the next time they are used. This is often done after performing a mutation (such as creating, updating, or deleting data) to ensure that any data displayed to the user is up-to-date

```tsx
queryClient.invalidateQueries({ queryKey: ["jobs"] });
queryClient.invalidateQueries({ queryKey: ["stats"] });
queryClient.invalidateQueries({ queryKey: ["charts"] });
```

### Why Invalidate Queries?

##### 1. Data Consistency:

After a mutation, the data on the server might change, and you want to make sure that the data displayed to the user reflects these changes.
Invalidating a query ensures that React Query will fetch the latest data from the server, keeping the UI consistent with the backend.

##### 2.Prevent Stale Data:

If you don’t invalidate the query, the data used in the app might become stale, and the UI might show outdated information.

# Actions

1. Create job actions

```tsx
// To understand what type to use, look where do you use the function and what parameters are expected.
export const createJobAction = async (
	values: CreateAndEditJobType
): Promise<JobType | null> => {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	const userId = authenticateAndRedirect();
	try {
		// validate the values against the schema
		createAndEditJobSchema.parse(values);
		const job: JobType = await prisma.job.create({
			data: {
				...values,
				clerkId: userId,
			},
		});
		console.log(job);
		return job;
	} catch (error) {
		console.log(error);
		return null;
	}
};
```

2. Create a function that gets all jobs related to a single clerk Id.

We are going to call this function in two places, once on the server side and second time when the page is rendered. For server, we do not need to provide anything, but for page rendering, the values should be provided.

A simple setup.

```tsx
type getAllJobsActionType = {
	search?: string;
	jobStatus?: string;
	page?: number;
	limit?: number;
};

export const getAllJobsAction = async ({
	search,
	jobStatus,
	page = 1,
	limit = 10,
}: getAllJobsActionType): Promise<{
	jobs: JobType[];
	count: number;
	totalPages: number;
	page: number;
}> => {
	const userId = authenticateAndRedirect();
	try {
		const { job } = prisma.job.findMany({
			where: {
				clerkId: userId,
			},
		});
		return jobs;
	} catch (error) {}
};
```

Adding more functionality

```tsx
type getAllJobsActionType = {
	search?: string;
	jobStatus?: string;
	page?: number;
	limit?: number;
};

export const getAllJobsAction = async ({
	search,
	jobStatus,
	page = 1,
	limit = 10,
}: getAllJobsActionType): Promise<{
	jobs: JobType[];
	count: number;
	totalPages: number;
	page: number;
}> => {
	const userId = authenticateAndRedirect();
	try {
		let whereClause: Prisma.JobWhereInput = {
			clerkId: userId,
		};

		if (search) {
			// Create a new where clause
			whereClause = {
				...whereClause,
				OR: [
					{
						position: {
							contains: search,
						},
					},
					{
						company: {
							contains: search,
						},
					},
				],
			};
		}

		if (jobStatus && jobStatus !== "all") {
			whereClause = {
				...whereClause,
				status: jobStatus,
			};
		}
		const jobs: JobType[] = await prisma.job.findMany({
			where: whereClause,
			orderBy: {
				createdAt: "desc",
			},
		});
		return { jobs, count: 0, totalPages: 0, page: 1 };
	} catch (error) {
		return { jobs: [], count: 0, totalPages: 0, page: 1 };
	}
};
```

# Jobs Page

```tsx
import JobsList from "@/components/JobsList";
import SearchForm from "@/components/SearchForm";
import {
	QueryClient,
	HydrationBoundary,
	dehydrate,
} from "@tanstack/react-query";
import { getAllJobsAction } from "@/utils/actions";

const JobsPage = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["jobs", "all", "", 1],
		queryFn: () => getAllJobsAction({}),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SearchForm></SearchForm>
			<JobsList></JobsList>
		</HydrationBoundary>
	);
};
export default JobsPage;
```

```sh
const queryClient = new QueryClient();

```

A new QueryClient is created. This client is responsible for managing the queries for this page, such as caching, deduplication, and fetching job data.

#### Prefetching Data with prefetchQuery

```tsx
await queryClient.prefetchQuery({
	queryKey: ["jobs", "all", "", 1],
	queryFn: () => getAllJobsAction({}),
});
```

`prefetchQuery` is called to fetch the job data before the component renders. This ensures that the data is ready when the page is served.

`queryKey`: The key that uniquely identifies this query. Here, ["jobs", "all", "", 1] signifies you're fetching all jobs on page 1 with no specific search term or job status.

`queryFn`: The function used to fetch the data. Here, getAllJobsAction({}) is called with an empty object, meaning no search filters or pagination parameters are applied, and it defaults to page 1.

#### `</HydrationBoundary>`

It is a component from react query that hydrates the data on the client side after being fetched on the server side.

##### Hydration:

Hydration refers to the process of taking static HTML (usually rendered on the server) and adding dynamic interactivity to it on the client (browser). After the initial HTML is sent to the browser from the server, JavaScript runs on the client to make the page interactive (e.g., attaching event listeners, loading data, etc.).

In `React Query`, `"hydrating"` means reusing the pre-fetched server-side data on the client side without having to refetch it.
When data is fetched on the server during SSR, it's stored in a React Query cache. Once the page reaches the client, React Query "hydrates" the cache with the server-fetched data so that the client can use it right away without making another network request.

### What Does "Serialize" and "Dehydrate" Mean?

`Serialization` means converting an object or data structure into a format (usually a string) that can be easily transmitted or stored. In web development, this is commonly done when you need to send complex objects (like data fetched from a database) from the server to the client, usually as JSON.

`Dehydration` in React Query refers to converting the in-memory cache (with all its data and metadata) into a plain JSON object that can be transferred to the client-side (e.g., as part of the HTML payload) and later "rehydrated" by the client-side React app. In this process, only the essential data (e.g., query results) is retained, and the more complex parts (e.g., methods, class instances) are removed.

For instance, When you're server-side rendering a page with React Query, you might fetch a list of jobs. React Query stores the result in its cache. Before sending the HTML to the client, you dehydrate the cache, turning it into a serialized form that can be sent along with the HTML. This way, when the client-side React code takes over, it can rehydrate the cache and use the data without needing to refetch it.

#### How it works?

##### Dehydration:

When you fetch data on the server during SSR, React Query holds this data in its cache. Before sending the page to the client, you dehydrate this cache—serialize the cache into a JSON format that can be sent in the HTML or initial state.

##### Hydration:

Once the client receives the page, the HydrationBoundary component is used to "hydrate" the React Query cache—this means taking the dehydrated (serialized) cache from the server and reloading it into React Query’s client-side cache, so the page can render immediately with the data already fetched on the server, without a second network request.

### Finally

##### Server Side:

The job data is fetched using getAllJobsAction and stored in the queryClient cache.
You dehydrate this cache with dehydrate(queryClient), serializing the cache into a JSON format that will be sent along with the HTML response.

##### Client Side:

The client receives the server-rendered HTML.
When React Query is initialized on the client side, it hydrates the cache with the pre-fetched data passed in the HydrationBoundary, allowing the client-side components (like JobsList) to use this data without refetching it.

##### Hydrate:

Make the server-fetched data available to the client-side React app, so it doesn’t need to refetch it.

##### Dehydrate:

Serialize the server-side cache into a format that can be sent to the client, so it can be rehydrated on the client side.

## Search Form

```tsx
// searchForm.tsx

"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectTrigger,
	SelectItem,
	SelectContent,
	SelectValue,
} from "./ui/select";
import { JobStatus } from "@/utils/types";
import React from "react";

const SearchForm = () => {
	const router = useRouter();
	const pathname = usePathname();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const searchVal = formData.get("search") as string;
		const jobStatusVal = formData.get("jobStatus") as string;
		// lets construct a new url with search params using URLSearchParams
		let params = new URLSearchParams();
		params.set("search", searchVal);
		params.set("jobStatus", jobStatusVal);
		router.push(`${pathname}?${params.toString()}`);
		console.log(searchVal, jobStatusVal);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mb-16 p-8 grid sm:grid-cols-2 md:grid-cols-3  gap-4 rounded-lg">
			<Input type="text" placeholder="Search Jobs" name="search" />
			<Select name="jobStatus">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{["all", ...Object.values(JobStatus)].map((jobStatus) => {
						return (
							<SelectItem key={jobStatus} value={jobStatus}>
								{jobStatus}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
			<Button type="submit">Search</Button>
		</form>
	);
};
export default SearchForm;
```

```tsx
const SearchForm = () => {
	// It provides functions for routing withing our application.
	const router = useRouter();
	// It returns the current path without query params
	const pathname = usePathname();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const searchVal = formData.get("search") as string;
		const jobStatusVal = formData.get("jobStatus") as string;
		// lets construct a new url with search params using URLSearchParams
		let params = new URLSearchParams();
		params.set("search", searchVal);
		params.set("jobStatus", jobStatusVal);
		router.push(`${pathname}?${params.toString()}`);
		console.log(searchVal, jobStatusVal);
	};
};
```

`const formData = new FormData(e.currentTarget)`

This creates a new FormData object, which contains all the data entered into the form. e.currentTarget refers to the form element that was submitted.
FormData is a useful interface for extracting form inputs in a key-value format.

`const searchVal = formData.get("search") as string;` retrieves the input value of search input

`let params = new URLSearchParams()`

This creates a URLSearchParams object, which allows us to easily manipulate the query string of a URL (the part after the ?).

`params.set("jobStatus", jobStatusVal)`

This sets the jobStatus query parameter to the value stored in jobStatusVal, similar to the search parameter.

`router.push(${pathname}?${params.toString()})`

This constructs a new URL by combining the current pathname (the URL path without query parameters) and the new query string created using params.toString().

The `router.push()` method navigates to the new URL, updating the browser's address bar and rendering the appropriate page with the new search and job status parameters in the query string.`

#### Events

`e.target`:

Refers to the element that triggered the event, i.e., the element that was interacted with to fire the event.
This could be any child element inside the form, such as a button or input field that the user clicked on.

`e.currentTarget`:

Refers to the element that the event handler is attached to.
Here, the event handler is attached to the form, so e.currentTarget refers to the form element itself.

```tsx
const searchParams = useSearchParams();
const search = searchParams.get("search") || "";
const jobStatusParam = searchParams.get("jobStatus") || "all";
```

Using the above hook, we can get the search parameters and set the default value of our input field to them.

## JobsList

```tsx

const JobsList = () => {
	const searchParams = useSearchParams();
	const search = searchParams.get("search") || "";
	const jobStatus = searchParams.get("jobStatus") || "";
	// Get the page number if exists and convert to a number
	const pageNumber = Number(searchParams.get("page")) || 1;

	const { data, isPending } = useQuery({
		// To refetch the data every time one of these params changes
		queryKey: ["all", search, jobStatus, pageNumber],
		queryFn: () => {
			// to query the database based on theses params
			return getAllJobsAction({ search, jobStatus, page: pageNumber });
		},
	});
```

## Delete Job

```tsx
// "use client";
import { Button } from "./ui/button";
import {
	QueryClient,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

import { deleteJobAction } from "@/utils/actions";
import { useToast } from "@/hooks/use-toast";

const DeleteJobButton = ({ id }: { id: string }) => {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: (id: string) => {
			return deleteJobAction(id);
		},
		onSuccess: (data) => {
			if (!data) {
				toast({
					description: "there was an error",
				});
				return;
			}
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
			queryClient.invalidateQueries({ queryKey: ["stats"] });
			queryClient.invalidateQueries({ queryKey: ["charts"] });
			toast({ description: "job removed" });
		},
	});

	return (
		<Button size="sm" onClick={() => mutate(id)} disabled={isPending}>
			{isPending ? "deleting..." : "delete"}
		</Button>
	);
};
export default DeleteJobButton;
```

`const queryClient = useQueryClient()`: This accesses to the already created query client, it is usually used for operations like manually invalidating queries, refetching data or directly accessing the cached data.

## Update Job

```tsx
// action.tsx

export const updateJobAction = async (
	id: string,
	values: CreateAndEditJobType
): Promise<JobType | null> => {
	const userId = authenticateAndRedirect();
	try {
		const job: JobType = await prisma.job.update({
			where: {
				id,
				clerkId: userId,
			},
			data: {
				...values,
			},
		});
		return job;
	} catch (error) {
		return null;
	}
};
```

`data: {...values}`: spreads the properties of the values object into the data object, which Prisma uses to update the corresponding fields in the database.

## Seed Database

[mock-data](https://www.mockaroo.com/)
save the data in prisma.
then run `node prisma/seed`.

## Stats page

```sh
 npx shadcn@latest add skeleton
```

### Loading

```tsx
// stats/loading.tsx
import { StatsLoadingCard } from "@/components/StatsCard";
function loading() {
	return (
		<div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
			<StatsLoadingCard />
			<StatsLoadingCard />
			<StatsLoadingCard />
		</div>
	);
}
export default loading;
```

```tsx
// jobs/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

function loading() {
	return (
		<div className="p-8 grid sm:grid-cols-2 md:grid-cols-3  gap-4 rounded-lg border">
			<Skeleton className="h-10" />
			<Skeleton className="h-10 " />
			<Skeleton className="h-10 " />
		</div>
	);
}
export default loading;
```

## Pagination Container

```tsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ButtonContainerProps = {
	currentPage: number;
	totalPages: number;
};

type ButtonProps = {
	page: number;
	activeClass: boolean;
};

import { Button } from "./ui/button";
const ComplexButtonContainer = ({
	currentPage,
	totalPages,
}: ButtonContainerProps) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

	const handlePageChange = (page: number) => {
		const defaultParams = {
			search: searchParams.get("search") || "",
			jobStatus: searchParams.get("jobStatus") || "",
			page: String(page),
		};

		let params = new URLSearchParams(defaultParams);

		router.push(`${pathname}?${params.toString()}`);
	};

	const addPageButton = ({ page, activeClass }: ButtonProps) => {
		return (
			<Button
				key={page}
				size="icon"
				variant={activeClass ? "default" : "outline"}
				onClick={() => handlePageChange(page)}>
				{page}
			</Button>
		);
	};

	const renderPageButtons = () => {
		const pageButtons = [];
		// first page
		pageButtons.push(
			addPageButton({ page: 1, activeClass: currentPage === 1 })
		);
		// dots

		if (currentPage > 3) {
			pageButtons.push(
				<Button size="icon" variant="outline" key="dots-1">
					...
				</Button>
			);
		}
		// one before current page
		if (currentPage !== 1 && currentPage !== 2) {
			pageButtons.push(
				addPageButton({
					page: currentPage - 1,
					activeClass: false,
				})
			);
		}
		// current page
		if (currentPage !== 1 && currentPage !== totalPages) {
			pageButtons.push(
				addPageButton({
					page: currentPage,
					activeClass: true,
				})
			);
		}
		// one after current page

		if (currentPage !== totalPages && currentPage !== totalPages - 1) {
			pageButtons.push(
				addPageButton({
					page: currentPage + 1,
					activeClass: false,
				})
			);
		}
		if (currentPage < totalPages - 2) {
			pageButtons.push(
				<Button size="icon" variant="outline" key="dots-1">
					...
				</Button>
			);
		}
		pageButtons.push(
			addPageButton({
				page: totalPages,
				activeClass: currentPage === totalPages,
			})
		);
		return pageButtons;
	};

	return (
		<div className="flex  gap-x-2">
			{/* prev */}
			<Button
				className="flex items-center gap-x-2 "
				variant="outline"
				onClick={() => {
					let prevPage = currentPage - 1;
					if (prevPage < 1) prevPage = totalPages;
					handlePageChange(prevPage);
				}}>
				<ChevronLeft />
				prev
			</Button>
			{renderPageButtons()}
			{/* next */}
			<Button
				className="flex items-center gap-x-2 "
				onClick={() => {
					let nextPage = currentPage + 1;
					if (nextPage > totalPages) nextPage = 1;
					handlePageChange(nextPage);
				}}
				variant="outline">
				next
				<ChevronRight />
			</Button>
		</div>
	);
};
export default ComplexButtonContainer;
```
