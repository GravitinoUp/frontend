import ExpandDown from '@/assets/icons/expand_down.svg'
import ExpandUp from '@/assets/icons/expand_up.svg'
import { formatDate } from '@/utils/helpers'

interface Props {
    open?: boolean
}

const CalendarForm = ({ open }: Props) => (
    <div className="flex bg-white rounded-xl px-3 py-4 mb-7 justify-between items-center">
        <div />
        <p className="font-bold text-2xl text-[#3F434A]">
            {formatDate(new Date())}
        </p>
        {open ? <ExpandUp /> : <ExpandDown />}
    </div>
)

export default CalendarForm
