
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAutumn } from "autumn-js/react";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ProductChangeDialog = (params: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const { attach } = useAutumn();
  const { open, setOpen, preview } = params;

  // Available event dates
  const eventDates = [
    { id: '2024-06-28', label: 'Saturday 6/28' },
    { id: '2024-07-05', label: 'Saturday 7/5' },
    { id: '2024-07-12', label: 'Saturday 7/12' },
    { id: '2024-07-19', label: 'Saturday 7/19' },
    { id: '2024-07-26', label: 'Saturday 7/26' },
  ];

  const handleConfirm = async () => {
    // For single ticket, require event selection
    if (preview.product_id === 'single_ticket' && !selectedEvent) {
      return;
    }

    setIsLoading(true);
    await attach({ 
      productId: preview.product_id,
      metadata: preview.product_id === 'single_ticket' ? { selectedEvent } : undefined
    });
    setOpen(false);
    setIsLoading(false);
  };

  const showEventSelection = preview.product_id === 'single_ticket';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{preview?.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>{preview?.message}</div>
          
          {showEventSelection && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select your event date:</Label>
              <RadioGroup value={selectedEvent} onValueChange={setSelectedEvent}>
                {eventDates.map((event) => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={event.id} id={event.id} />
                    <Label htmlFor={event.id} className="cursor-pointer">
                      {event.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
          
          {preview?.due_today?.price && (
            <div className="text-lg font-semibold">
              Due today: ${preview.due_today.price}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isLoading || (showEventSelection && !selectedEvent)}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductChangeDialog;
