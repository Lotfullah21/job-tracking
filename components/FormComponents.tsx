import { Select, SelectContent, SelectTrigger, SelectItem } from "./ui/select";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";

import { Input } from "./ui/input";
import { Control, FieldValues, Path } from "react-hook-form";
import { SelectValue } from "@radix-ui/react-select";

type CustomFormFieldPropType<TFieldValues extends FieldValues = any> = {
	name: Path<TFieldValues>; // Ensure name is a valid path of the form data
	control: Control<TFieldValues>;
};

export const CustomFormField = <TFieldValues extends FieldValues = any>({
	name,
	control,
}: CustomFormFieldPropType<TFieldValues>) => {
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

type CustomFormSelectProps<TFieldValues extends FieldValues = any> = {
	name: Path<TFieldValues>; // Ensure name is a valid path of the form data
	control: Control<TFieldValues>;
	items: string[];
	labelText?: string;
};

export const CustomFormSelect = <TFieldValues extends FieldValues = any>({
	name,
	control,
	items,
	labelText,
}: CustomFormSelectProps<TFieldValues>) => {
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
