import JSZip from 'jszip'

const useDownload = () => {
    async function handleZip(fileName: string, images: string[]) {
        const zip = JSZip()

        for (let i = 0; i < images.length; i++) {
            const response = await fetch(images[i])
            const blob = await response.blob()

            zip.file(images[i].split('/').pop()!, blob)
        }

        const zipData = await zip.generateAsync({
            type: 'blob',
            streamFiles: true,
        })

        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(zipData)
        link.download = `${fileName}.zip`
        link.click()
    }

    return { handleZip }
}

export { useDownload }
