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
    <div>
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
