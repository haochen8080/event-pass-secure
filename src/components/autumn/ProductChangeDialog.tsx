
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAutumn } from "autumn-js/react";

const ProductChangeDialog = (params: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const { attach } = useAutumn();
  const { open, setOpen, preview } = params;

  // Available event dates
  const eventDates = [
    { id: 'saturday_6_28', label: 'Saturday 6/28' },
    { id: 'friday_7_5', label: 'Friday 7/5' },
    { id: 'saturday_7_12', label: 'Saturday 7/12' },
    { id: 'friday_7_19', label: 'Friday 7/19' },
    { id: 'saturday_7_26', label: 'Saturday 7/26' },
  ];

  const isSingleTicket = preview?.product_id === 'single_ticket';
  const isMonthlySubscription = preview?.product_id === 'subscription_monthly';

  const handleConfirm = async () => {
    if (isSingleTicket && !selectedDate) {
      alert('Please select an event date');
      return;
    }

    setIsLoading(true);
    
    const attachParams: any = { productId: preview.product_id };
    
    // Add selected event date as metadata for single tickets
    if (isSingleTicket && selectedDate) {
      attachParams.metadata = { selectedEventDate: selectedDate };
    }
    
    await attach(attachParams);
    setOpen(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{preview?.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>{preview?.message}</div>
          
          {/* Event selection for single tickets */}
          {isSingleTicket && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Event Date:</Label>
              <RadioGroup value={selectedDate} onValueChange={setSelectedDate}>
                {eventDates.map((date) => (
                  <div key={date.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={date.id} id={date.id} />
                    <Label htmlFor={date.id} className="text-sm">{date.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
          
          {/* Info for monthly subscription */}
          {isMonthlySubscription && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                ✓ Access to all events during your subscription period
              </p>
            </div>
          )}
          
          {preview?.due_today?.price && (
            <div className="font-medium">
              Due today: ${preview?.due_today?.price}
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductChangeDialog;
