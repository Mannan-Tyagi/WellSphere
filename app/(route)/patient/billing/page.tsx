"use client";

import React, { useState } from "react";
import BillingDashboard from "@/modules/patient-pages/billing/BillingDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, filterItems, getStatusBadge } from "@/utils/helpers";
import {
  CreditCard,
  ReceiptText,
  FileText,
  Download,
  CheckCircle,
  Calendar,
  Plus,
  FileDown,
  HelpCircle,
  Circle,
} from "lucide-react";
import ClaimSubmissionFlow from "@/components/ClaimSubmissionFlow";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("payments");
  const [showClaimSubmission, setShowClaimSubmission] = useState(false);
  const payments = []; // Replace with actual data
  const upcomingBills = []; // Replace with actual data
  const claims = []; // Replace with actual data
  const insurancePlans = []; // Replace with actual data
  const searchTerm = ""; // Replace with actual data
  const dateFilter = ""; // Replace with actual data

  return (
    <div>
      <BillingDashboard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-500 text-sm">Total Unpaid</p>
                <p className="text-2xl font-bold">{formatCurrency(225.0)}</p>
              </div>
              <CreditCard className="h-10 w-10 text-amber-500 p-2 bg-amber-100 rounded-full" />
            </div>
            <Button className="w-full mt-2 bg-[#006D77] hover:bg-[#00585F]">
              Pay Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-500 text-sm">Year-to-Date</p>
                <p className="text-2xl font-bold">{formatCurrency(1375.5)}</p>
              </div>
              <ReceiptText className="h-10 w-10 text-purple-500 p-2 bg-purple-100 rounded-full" />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Insurance Covered:</span>
                <span className="font-medium">{formatCurrency(1100.0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Out-of-Pocket:</span>
                <span className="font-medium">{formatCurrency(275.5)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-500 text-sm">Deductible Progress</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(750)}/{formatCurrency(1500)}
                </p>
              </div>
              <FileText className="h-10 w-10 text-blue-500 p-2 bg-blue-100 rounded-full" />
            </div>
            <div className="mt-3">
              <Progress value={50} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">
                50% of deductible met
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-6">
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="claims">Insurance Claims</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Plans</TabsTrigger>
        </TabsList>

        {/* Payments History Tab */}
        <TabsContent value="payments" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {filterItems(payments).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Provider</th>
                        <th className="px-4 py-3 text-left">Service</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Method</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterItems(payments).map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {new Date(payment.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.id}
                            </div>
                          </td>
                          <td className="px-4 py-3">{payment.provider}</td>
                          <td className="px-4 py-3">{payment.service}</td>
                          <td className="px-4 py-3 font-medium">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-3">{payment.method}</td>
                          <td className="px-4 py-3">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {payment.receipt && (
                              <Button variant="ghost" size="sm" className="h-8">
                                <Download size={16} className="mr-1" />
                                Receipt
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ReceiptText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No payment history found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm || dateFilter
                      ? "Try adjusting your filters"
                      : "Payments will appear here once made"}
                  </p>
                </div>
              )}

              {/* Upcoming Bills Section */}
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">Upcoming Bills</h3>

                {upcomingBills.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBills.map((bill) => (
                      <div
                        key={bill.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{bill.service}</h4>
                            <p className="text-sm text-gray-600">
                              {bill.provider}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(bill.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Insurance covers:{" "}
                              {Math.round(bill.insuranceCoverage * 100)}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-sm mt-2">
                          <Calendar size={14} className="text-gray-400 mr-1" />
                          <span className="text-gray-600">
                            Due: {new Date(bill.dueDate).toLocaleDateString()}
                          </span>
                          <span className="mx-2">•</span>
                          {getStatusBadge(bill.status)}
                        </div>

                        <div className="mt-3 flex justify-end">
                          <Button className="bg-[#006D77] hover:bg-[#00585F]">
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-700 font-medium">
                      No upcoming bills
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Claims Tab */}
        <TabsContent value="claims" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Insurance Claims</CardTitle>
                <Button
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  onClick={() => setShowClaimSubmission(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Submit New Claim
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filterItems(claims).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Provider</th>
                        <th className="px-4 py-3 text-left">Service</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Insurance</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterItems(claims).map((claim) => (
                        <tr
                          key={claim.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {new Date(claim.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {claim.id}
                            </div>
                          </td>
                          <td className="px-4 py-3">{claim.provider}</td>
                          <td className="px-4 py-3">{claim.service}</td>
                          <td className="px-4 py-3 font-medium">
                            {formatCurrency(claim.amount)}
                          </td>
                          <td className="px-4 py-3">
                            {claim.insuranceProvider}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(claim.status)}
                            {claim.status === "rejected" && (
                              <div className="text-xs text-red-600 mt-1">
                                {claim.rejectionReason}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm" className="h-8">
                              <FileDown size={16} className="mr-1" />
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No claims found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm || dateFilter
                      ? "Try adjusting your filters"
                      : "Submit a claim to get started"}
                  </p>
                  <Button
                    className="mt-4 bg-[#006D77] hover:bg-[#00585F]"
                    onClick={() => setShowClaimSubmission(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Submit New Claim
                  </Button>
                </div>
              )}

              {/* Claim Filing Tips */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <HelpCircle size={16} className="mr-2" />
                  Claim Filing Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <Circle
                      size={6}
                      className="mr-2 mt-1.5"
                      fill="currentColor"
                    />
                    Submit claims within 90 days of service for faster
                    processing
                  </li>
                  <li className="flex items-start">
                    <Circle
                      size={6}
                      className="mr-2 mt-1.5"
                      fill="currentColor"
                    />
                    Include all relevant documentation like receipts and
                    referrals
                  </li>
                  <li className="flex items-start">
                    <Circle
                      size={6}
                      className="mr-2 mt-1.5"
                      fill="currentColor"
                    />
                    Double-check all information before submitting to avoid
                    delays
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Plans Tab */}
        <TabsContent value="insurance" className="mt-0">
          <div className="space-y-6">
            {insurancePlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{plan.provider}</CardTitle>
                      <p className="text-sm text-gray-500">{plan.planName}</p>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Member ID:</span>
                          <span className="font-medium">{plan.memberId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Group Number:</span>
                          <span className="font-medium">
                            {plan.groupNumber}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Coverage Start:</span>
                          <span className="font-medium">
                            {new Date(plan.coverageStart).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Annual Deductible
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(plan.deductibleMet)} /{" "}
                            {formatCurrency(plan.deductible)}
                          </span>
                        </div>
                        <Progress
                          value={(plan.deductibleMet / plan.deductible) * 100}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round(
                            (plan.deductibleMet / plan.deductible) * 100
                          )}
                          % of deductible met
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Out-of-Pocket Maximum
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(plan.outOfPocketMet)} /{" "}
                            {formatCurrency(plan.outOfPocketMax)}
                          </span>
                        </div>
                        <Progress
                          value={
                            (plan.outOfPocketMet / plan.outOfPocketMax) * 100
                          }
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round(
                            (plan.outOfPocketMet / plan.outOfPocketMax) * 100
                          )}
                          % of maximum met
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="text-[#006D77] border-[#006D77]"
              >
                <Plus size={16} className="mr-2" />
                Add Insurance Plan
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Claim Submission Modal */}
      {showClaimSubmission && (
        <ClaimSubmissionFlow onClose={() => setShowClaimSubmission(false)} />
      )}
    </div>
  );
}
