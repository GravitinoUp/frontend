import { api } from '.'
import { TemplateType } from '@/types/interface/files'

export const filesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getEntityTemplate: builder.mutation<void, TemplateType>({
            query: (type) => ({
                url: `files/template/${type}`,
                method: 'GET',
                responseHandler: async (response) => {
                    if (response.ok) {
                        const fileBlob = await response.blob()

                        const url = window.URL.createObjectURL(
                            new Blob([fileBlob])
                        )
                        const link = document.createElement('a')
                        link.href = url
                        link.setAttribute(
                            'download',
                            `${response.url.split('/').pop()}.xlsx`
                        )
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                    }
                },
            }),
        }),
    }),
})

export const { useGetEntityTemplateMutation } = filesApi
