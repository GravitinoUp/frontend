import { api } from '.'
import { FetchResultInterface } from '@/types/interface/fetch'
import { TemplateType } from '@/types/interface/files'
import { downloadFile } from '@/utils/helpers'

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
        getFileFromUrl: builder.mutation<void, string>({
            query: (url) => ({
                url: url,
                method: 'GET',
                responseHandler: downloadFile,
            }),
        }),
        importData: builder.mutation<
            FetchResultInterface,
            { entity: TemplateType; formData: FormData }
        >({
            query: ({ entity, formData }) => ({
                url: `${entity}/import`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: (_result, _error, { entity }) => {
                switch (entity) {
                    case 'branch':
                        return ['Branches']
                    case 'checkpoint':
                        return ['Checkpoints']
                    case 'order':
                        return ['Orders']
                    case 'organization':
                        return ['Organizations', 'Users']
                    case 'role':
                        return ['Roles']
                    case 'users':
                        return ['Users']
                    case 'property':
                        return ['Properties']
                    default:
                        return []
                }
            },
        }),
    }),
})

export const {
    useGetEntityTemplateMutation,
    useGetFileFromUrlMutation,
    useImportDataMutation,
} = filesApi
