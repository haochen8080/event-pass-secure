
import React from 'react';
import { useCustomer } from 'autumn-js/react';

const AutumnTest = () => {
  const { customer } = useCustomer();
  
  console.log("Autumn Customer", customer);
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Autumn Integration Test</h3>
      <p className="text-sm text-blue-700">
        Check the browser console for the Autumn customer data.
      </p>
      {customer && (
        <p className="text-sm text-green-700 mt-2">
          ✓ Customer loaded: {customer.id}
        </p>
      )}
    </div>
  );
};

export default AutumnTest;
