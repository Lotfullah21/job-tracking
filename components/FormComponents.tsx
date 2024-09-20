import { Select, SelectContent, SelectTrigger, SelectItem } from "./ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";

import { Input } from "./ui/input";
import { Control } from "react-hook-form";
import { SelectValue } from "@radix-ui/react-select";

type CustomFormFieldPropType = {
	name: string;
	control: Control<any>;
};

export const CustomFormField = ({ name, control }: CustomFormFieldPropType) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="capitalize">{name}</FormLabel>
					<FormControl className="border-gray-600">
						<Input {...field}></Input>
					</FormControl>
					<FormMessage></FormMessage>
				</FormItem>
			)}></FormField>
	);
};

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
							<FormControl className="border-gray-600">
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
