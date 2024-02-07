import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    FIO: z.string(),
    email: z.string(),
    password: z.string(),
    repassword: z.string(),
    gender: z.string(),
    company: z.string(),
});

const gender = [
    { label: "Мужской", value: "Мужской" },
    { label: "Женский", value: "Женский" },
] as const;

export function SettingsForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            FIO: "",
            email: "",
            password: "",
            repassword: "",
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function onSubmit(data: z.infer<typeof formSchema>) {}

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-rows-7 grid-col-2 gap-5 "
                >
                    <div className="col-1 row-1 ">
                        <FormField
                            control={form.control}
                            name="FIO"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=" flex  items-center">
                                        <p className="text-[#8A9099]">ФИО</p>
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            onKeyPress={(e) => {
                                                const keyCode = e.keyCode
                                                    ? e.keyCode
                                                    : e.which;
                                                if (
                                                    (keyCode > 47 &&
                                                        keyCode < 58) ||
                                                    (keyCode > 95 &&
                                                        keyCode < 107)
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            type="text"
                                            className="rounded-xl"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-1 row-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=" flex  items-center">
                                        <p className="text-[#8A9099]">Email</p>
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            type="email"
                                            className="rounded-xl"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-1 row-3">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className=" flex  items-center">
                                        <p className="text-[#8A9099]">Пол</p>
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        " justify-between",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? gender.find(
                                                              (gender) =>
                                                                  gender.value ===
                                                                  field.value
                                                          )?.label
                                                        : "Выберите пол"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className=" p-0">
                                            <Command>
                                                <CommandGroup>
                                                    {gender.map((gender) => (
                                                        <CommandItem
                                                            value={gender.label}
                                                            key={gender.value}
                                                            onSelect={() => {
                                                                form.setValue(
                                                                    "gender",
                                                                    gender.value
                                                                );
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    gender.value ===
                                                                        field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {gender.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-2 row-1">
                        <Button
                            className="rounded-xl h-9  w-32 bg-primary hover:bg-primary "
                            variant="default"
                            onClick={() => {}}
                        >
                            Изменить
                        </Button>

                        <Button
                            className="rounded-xl h-9  w-32 bg-[#EDEDED] text-[#8A9099]  hover:bg-destructive hover:text-white "
                            variant="default"
                            onClick={() => {}}
                        >
                            Отменить
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
