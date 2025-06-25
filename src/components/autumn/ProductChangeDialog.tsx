
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAutumn } from "autumn-js/react";

const ProductChangeDialog = (params: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { attach } = useAutumn();
  const { open, setOpen, preview } = params;

  const handleConfirm = async () => {
    setIsLoading(true);
    await attach({ productId: preview.product_id });
    setOpen(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{preview?.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{preview?.message}</p>
          {preview?.due_today?.price && (
            <p className="font-semibold mt-2">Due today: ${preview?.due_today?.price}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductChangeDialog;
