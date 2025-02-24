import CashflowChart from '@/modules/doctor-pages/dashboard/CashflowChart'
import ExpensesChart from '@/modules/doctor-pages/dashboard/ExpensesChart'
import IncomeExpenseChart from '@/modules/doctor-pages/dashboard/IncomeExpenseChart'
import PatientsOverview from '@/modules/doctor-pages/dashboard/PatientsOverview'
import PopularTreatments from '@/modules/doctor-pages/dashboard/PopularTreatments'
import QuickStats from '@/modules/doctor-pages/dashboard/QuickStats'
import StockAvailability from '@/modules/doctor-pages/dashboard/StockAvailability'
import React from 'react'

export default function dashboard() {
  return (
    <div className="p-2 md:p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Good morning, Dr. Johnson!</h1>
        <p className="text-gray-500">Here&apos;s what&apos;s happening with your hospital today.</p>
      </div>

      <QuickStats />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {/* Cashflow Chart */}
        <CashflowChart />

        {/* Expenses Chart */}
        <ExpensesChart />

        {/* Income & Expense */}
        <IncomeExpenseChart />

        {/* Patients Overview */}
        <PatientsOverview />

        {/* Popular Treatments */}
        <PopularTreatments />

        {/* Stock Availability */}
        <StockAvailability />
      </div>
    </div>
  )
}
