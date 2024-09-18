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

<Form {...form}>: This wraps the entire form and spreads the form object, which contains methods and data for form handling.

`form.handleSubmit(onSubmit)`: This method is passed to the <form> tag to handle form submission and run the validation logic defined earlier.

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

#### 2. <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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

## prisma

It helps us to interact with a database.
