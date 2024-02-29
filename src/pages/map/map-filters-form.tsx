import CustomForm, { useForm } from "@/components/form/form"
import { FormField } from "@/components/ui/form"
import { CHECKPOINT_TYPES } from "@/constants/constants"
import { cn } from "@/lib/utils"
import { Dispatch, Fragment, SetStateAction } from "react"
import { useTranslation } from "react-i18next"
import CarIcon from '@/assets/icons/car_icon.svg'
import TrainIcon from '@/assets/icons/train_icon.svg'
import ShipIcon from '@/assets/icons/ship_icon.svg'
import PeopleIcon from '@/assets/icons/people_icon.svg'
import PlaneIcon from '@/assets/icons/plane_icon.svg'
import MixedIcon from '@/assets/icons/mixed_icon.svg'

import { z } from 'zod'
import { InputField } from "@/components/input-field/input-field"
import { Button } from "@/components/ui/button"

const filterSchema = z.object({
    checkpoint_types: z.array(z.number()),
    minPercent: z.string().default('0').refine((value) => Number(value) >= 0 && Number(value) <= 100, 'Число должно быть от 0 до 100'),
    maxPercent: z.string().default('100').refine((value) => Number(value) >= 0 && Number(value) <= 100, 'Число должно быть от 0 до 100'),
})

interface MapFiltersFormProps {
    handleSubmit: (values: z.infer<typeof filterSchema>) => void,
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
    data?: z.infer<typeof filterSchema>
}

const MapFiltersForm = ({ handleSubmit, setDialogOpen, data }: MapFiltersFormProps) => {
    const form = useForm({
        schema: filterSchema,
        defaultValues: data,
    })

    const { t } = useTranslation()

    return (
        <CustomForm form={form} onSubmit={handleSubmit}>
            <h2 className="text-3xl font-semibold">{t('choose.filters')}</h2>
            <FormField
                control={form.control}
                name="checkpoint_types"
                render={({ field }) => (
                    <Fragment>
                        <h3 className="mt-6 mb-3 text-xl">
                            {t('map.filters.choose.checkpoints')}
                        </h3>
                        <div className="flex flex-wrap gap-7">
                            {Object.values(CHECKPOINT_TYPES).map((type) => (
                                <div
                                    key={type}
                                    className={cn(
                                        field.value.find(
                                            (value) => value === type,
                                        )
                                            ? 'bg-[#3F434A]'
                                            : 'bg-muted',
                                        'p-2 rounded-full hover:bg-[#3F434A] group',
                                    )}
                                    onClick={() => {
                                        if (
                                            !field.value.find(
                                                (value) => value === type,
                                            )
                                        ) {
                                            field.onChange([
                                                ...field.value,
                                                type,
                                            ])
                                        } else {
                                            field.onChange(
                                                field.value.filter(
                                                    (value) => value !== type,
                                                ),
                                            )
                                        }
                                    }}
                                >
                                    <div className={`
                                            w-6 h-6
                                            flex items-center justify-center
                                            ${field.value.find(
                                        (value) => value === type,
                                    )
                                            ? 'fill-muted'
                                            : 'fill-[#3F434A]'}
                                                group-hover:fill-muted
                                        `}>
                                        {type == CHECKPOINT_TYPES.CAR && <CarIcon />}
                                        {type == CHECKPOINT_TYPES.TRAIN && <TrainIcon />}
                                        {type == CHECKPOINT_TYPES.SHIP && <ShipIcon />}
                                        {type == CHECKPOINT_TYPES.PLANE && <PlaneIcon />}
                                        {type == CHECKPOINT_TYPES.RIVER && <ShipIcon />}
                                        {type == CHECKPOINT_TYPES.MIXED && <MixedIcon />}
                                        {type == CHECKPOINT_TYPES.PEOPLE && <PeopleIcon />}
                                        {type == CHECKPOINT_TYPES.LAKE && <ShipIcon />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Fragment>
                )}
            />

            <Fragment >
                <div className="flex mt-6">
                    <h3 className="text-xl">
                        Показывать по проценту исполненных задач
                    </h3>
                    <div className="border rounded-2xl flex items-center p-2">
                        <FormField
                            control={form.control}
                            name="minPercent"
                            render={({ field }) => (
                                <InputField
                                    prefixIcon={<span className="mx-2 flex items-center font-medium text-sm"><p className="font-black text-lg mr-1">%</p>от</span>}
                                    {...field}
                                />
                            )}
                        />
                        <div className="h-[1px] bg-[#E8E9EB] w-8 mx-3" />
                        <FormField
                            control={form.control}
                            name="maxPercent"
                            render={({ field }) => (
                                <InputField
                                    prefixIcon={<span className="mx-2 flex items-center font-medium text-sm"><p className="font-black text-lg mr-1">%</p>до</span>}
                                    {...field}
                                />
                            )}
                        />
                    </div>
                </div>
            </Fragment>
            <div className="flex items-center">
                <Button
                    className="mt-10 mr-4 px-10"
                    type="submit"
                >
                    {t('button.action.apply')}
                </Button>
                <Button
                    className="px-10 mt-10"
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen!(false)}
                >
                    {t('button.action.reset')}
                </Button>
            </div>
        </CustomForm>
    )
}

export default MapFiltersForm