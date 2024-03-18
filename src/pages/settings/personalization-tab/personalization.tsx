import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.tsx'
import { getCurrentColorScheme } from '@/utils/helpers.ts'

const colorSchemeVariants = [
    {
        name: 'option-1',
        color: '#0784D1',
    },
    {
        name: 'option-2',
        color: '#FD7972',
    },
    {
        name: 'option-3',
        color: '#FF965D',
    },
    {
        name: 'option-4',
        color: '#FFD240',
    },
    {
        name: 'option-5',
        color: '#49C96D',
    },
]

const Personalization = () => {
    const { t } = useTranslation()
    const [colorScheme, setColorScheme] = useState(() =>
        getCurrentColorScheme()
    )

    const handleColorSchemeChange = (variant: string) => {
        document
            .querySelector('html')
            ?.setAttribute('data-color-scheme', variant)
        setColorScheme(variant)
        localStorage.setItem('colorScheme', variant)
    }

    return (
        <div className="flex justify-between items-center px-5">
            <p>{t('settings.personalization.color.scheme')}</p>
            <div className="flex gap-4 items-center">
                <Button
                    variant="ghost"
                    onClick={() => handleColorSchemeChange('option-1')}
                >
                    {t('by.default')}
                </Button>
                {colorSchemeVariants.map(({ name, color }) => (
                    <Button
                        key={name}
                        variant="ghost"
                        className="w-6 h-6 rounded-full p-0 hover:opacity-70"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSchemeChange(name)}
                    >
                        {colorScheme === name && (
                            <span className="h-2 w-2 bg-white rounded-full" />
                        )}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default Personalization
