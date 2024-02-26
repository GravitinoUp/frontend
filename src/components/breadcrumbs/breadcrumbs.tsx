import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ArrowLeft from '@/assets/icons/arrow_left.svg'

interface BreadcrumbsProps {
    items: { to: string; label: string }[]
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    const location = useLocation()

    return (
        <div className="flex items-center h-10 mb-4">
            {items.map(
                (value, index) =>
                    location.pathname.includes(value.to) && (
                        <Fragment key={value.to}>
                            {index !== 0 && (
                                <div className="mx-2">
                                    <ArrowLeft />
                                </div>
                            )}
                            <Link
                                to={value.to}
                                state={location.state}
                                onClick={(event) =>
                                    value.to === '' && event.preventDefault()
                                }
                                className={`text-lg ${
                                    location.pathname === value.to
                                        ? 'font-bold'
                                        : 'text-body-light'
                                }`}
                            >
                                {value.label}
                            </Link>
                        </Fragment>
                    )
            )}
        </div>
    )
}

export default Breadcrumbs
