import React from "react";

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Filter items based on search term and date filter
 */
export function filterItems<T extends { [key: string]: any }>(
  items: T[],
  searchTerm: string = "",
  dateFilter: string = "",
  dateField: string = "date"
): T[] {
  if (!items || !items.length) return [];

  return items.filter((item) => {
    // Search term filter
    if (searchTerm) {
      const searchable = Object.values(item).join(" ").toLowerCase();
      if (!searchable.includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    // Date filter
    if (dateFilter) {
      const itemDate = new Date(item[dateField]);
      const filterDate = new Date(dateFilter);

      // Compare year and month for date filtering
      if (
        itemDate.getFullYear() !== filterDate.getFullYear() ||
        itemDate.getMonth() !== filterDate.getMonth()
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get status badge configuration based on status string
 */
export function getStatusBadge(status: string): {
  className: string;
  text: string;
} {
  const statusConfig: Record<string, { className: string; text: string }> = {
    paid: {
      className:
        "bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium",
      text: "Paid",
    },
    pending: {
      className:
        "bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium",
      text: "Pending",
    },
    processing: {
      className:
        "bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium",
      text: "Processing",
    },
    rejected: {
      className:
        "bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium",
      text: "Rejected",
    },
    approved: {
      className:
        "bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium",
      text: "Approved",
    },
    due: {
      className:
        "bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium",
      text: "Due",
    },
  };

  const config = statusConfig[status.toLowerCase()] || {
    className:
      "bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium",
    text: status,
  };

  return config;
}
