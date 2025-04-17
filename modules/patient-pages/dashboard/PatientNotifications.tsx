"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PatientNotifications = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const notifications = []; // Replace with actual notifications data

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "unread" ? "default" : "outline"}
              onClick={() => setActiveFilter("unread")}
            >
              Unread
            </Button>
          </div>
          <div>
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className="p-4 border rounded-md bg-gray-50 text-gray-700"
                  >
                    {notification.message}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center text-gray-500">
                <p>No notifications found</p>
                <Button
                  variant="outline"
                  className="mt-2 text-[#006D77] border-[#006D77]"
                  onClick={() => setActiveFilter("all")}
                >
                  View All Notifications
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 text-center text-xs text-gray-500">
          <p>Notifications are updated in real-time</p>
          <p>Last refreshed: {new Date().toLocaleTimeString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientNotifications;