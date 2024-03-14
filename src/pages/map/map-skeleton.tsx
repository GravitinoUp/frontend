import { Layout } from '@/components/Layout.tsx'
import { LoadingSpinner } from '@/components/spinner/spinner.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const MapSkeleton = () => (
    <Layout>
        <div className="w-full h-full flex flex-col border-2 relative">
            <div className="border-b-2 bg-white flex justify-between items-center px-6 h-[80px]">
                <Skeleton className="h-8 w-[247px] rounded-xl" />
                <Skeleton className="h-11 w-11 rounded-xl" />
            </div>
            <div className="flex justify-center items-center h-screen mx-auto">
                <LoadingSpinner className="w-16 h-16 text-primary" />
            </div>
        </div>
    </Layout>
)

export default MapSkeleton
