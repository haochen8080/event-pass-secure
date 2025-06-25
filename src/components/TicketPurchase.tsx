
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAutumn, useCustomer } from "autumn-js/react";
import ProductChangeDialog from './autumn/ProductChangeDialog';

const TicketPurchase = () => {
  const { attach } = useAutumn();
  const { customer } = useCustomer();

  const hasActiveSubscription = customer?.products?.find(p => p.id === 'subscription_monthly');
  const hasSingleTicket = customer?.products?.find(p => p.id === 'single_ticket');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* Single Event Pass */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-xl">Single Event Pass</CardTitle>
          <div className="text-3xl font-bold text-purple-600">$9.99</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Access to one selected event</li>
            <li>• Choose your event date during purchase</li>
            <li>• Perfect for trying out our events</li>
          </ul>
          <Button
            onClick={async () =>
              await attach({
                productId: "single_ticket",
                dialog: ProductChangeDialog,
              })
            }
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={!!hasSingleTicket}
          >
            {hasSingleTicket ? 'Already Purchased' : 'Buy Single Pass'}
          </Button>
        </CardContent>
      </Card>

      {/* Monthly Subscription */}
      <Card className="relative border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-xl">Monthly Subscription</CardTitle>
          <div className="text-3xl font-bold text-purple-600">$14.99<span className="text-base font-normal">/month</span></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Unlimited access to all events</li>
            <li>• Attend any event during your subscription</li>
            <li>• Best value for regular attendees</li>
          </ul>
          <Button
            onClick={async () =>
              await attach({
                productId: "subscription_monthly",
                dialog: ProductChangeDialog,
              })
            }
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={!!hasActiveSubscription}
          >
            {hasActiveSubscription ? 'Currently Subscribed' : 'Subscribe Monthly'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketPurchase;
