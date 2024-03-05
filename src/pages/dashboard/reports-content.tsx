import DataTable from "@/components/data-table/data-table"
import { useGetBranchReportsQuery } from "@/redux/api/reports"
import { BranchReportsPayloadInterface } from "@/types/interface/reports"
import { useState } from "react"
import { dashboardReportsColumns } from "./dashboard-reports-columns"

export default function ReportsContent({ selectedDay }: { selectedDay: string }) {

}