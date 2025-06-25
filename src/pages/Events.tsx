
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAutumn, useCustomer } from "autumn-js/react";
import ProductChangeDialog from '../components/autumn/ProductChangeDialog';

const Events = () => {
  const { attach, check, track } = useAutumn();
  const { customer, refetch } = useCustomer();

  const hasSubscription = customer?.products?.find((p) => p.id === "subscription_monthly");

  const handleSubscribe = async () => {
    await attach({
      productId: "subscription_monthly",
      dialog: ProductChangeDialog,
    });
  };

  const handleAttendEvent = async () => {
    let { data } = await check({ featureId: " ticket_pass" });

    if (data?.allowed) {
      await track({ featureId: " ticket_pass" });
      await refetch();
      alert("Event attendance recorded!");
    } else {
      alert("Please subscribe to attend events.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Summer Music Festival
        </h1>
        
        <div className="mb-8">
          <p className="text-gray-600 mb-2">August 15, 2024</p>
          <p className="text-gray-600">Central Park</p>
        </div>

        {!hasSubscription ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Monthly Subscription</h3>
              <p className="text-2xl font-bold text-purple-600 mb-2">$14.99/month</p>
              <p className="text-gray-600 mb-4">Unlimited event access</p>
              <Button onClick={handleSubscribe} className="w-full">
                Subscribe Now
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-green-200 bg-green-50 rounded-lg p-6">
              <p className="text-green-800 mb-4">✓ You have unlimited access</p>
              <Button onClick={handleAttendEvent} className="w-full">
                Attend Event
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
