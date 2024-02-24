import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
    FIO: z.string(),
    email: z.string(),
    password: z.string(),
    repassword: z.string(),
    company: z.string(),
})

export function SettingsForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            FIO: '',
            email: '',
            password: '',
            repassword: '',
        },
    })
    const { t } = useTranslation()

    // async function onSubmit(data: z.infer<typeof formSchema>) {}

    return (
        <>
            <Form {...form}>
                <form
                    // onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-rows-7 grid-col-2 gap-5 "
                >
                    <div className="col-1 row-1 ">
                        <FormField
                            control={form.control}
                            name="FIO"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=" flex  items-center">
                                        <p className="text-[#8A9099]">{t('full.name')}</p>
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            onKeyPress={(e) => {
                                                const keyCode = e.keyCode
                                                    ? e.keyCode
                                                    : e.which
                                                if (
                                                    (keyCode > 47 &&
                                                        keyCode < 58) ||
                                                    (keyCode > 95 &&
                                                        keyCode < 107)
                                                ) {
                                                    e.preventDefault()
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
                    <div className="col-2 row-1 flex gap-5">
                        <Button
                            className="rounded-xl h-9  w-32 bg-primary hover:bg-primary "
                            variant="default"
                            onClick={() => {
                            }}
                        >
                            {t('button.action.change')}
                        </Button>
                        <Button
                            className="rounded-xl h-9  w-32 bg-[#EDEDED] text-[#8A9099]  hover:bg-destructive hover:text-white "
                            variant="default"
                            onClick={() => {
                            }}
                        >
                            {t('button.action.cancel')}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
