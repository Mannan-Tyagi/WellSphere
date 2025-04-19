import { useState } from 'react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'hsa';
  name: string;
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
  cardType?: string;
  bankName?: string;
}

export function usePaymentMethods() {
  // Mock payment methods data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'card-1',
      type: 'card',
      name: 'Credit Card',
      last4: '4321',
      expiryDate: '09/28',
      isDefault: true,
      cardType: 'visa'
    },
    {
      id: 'bank-1',
      type: 'bank',
      name: 'Bank of America',
      last4: '6789',
      isDefault: false,
      bankName: 'Bank of America'
    },
    {
      id: 'hsa-1',
      type: 'hsa',
      name: 'Health Savings Account',
      last4: '3456',
      isDefault: false,
      bankName: 'HSA Bank'
    }
  ]);
  
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    paymentMethods.find(pm => pm.isDefault)?.id || ''
  );
  
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    setSelectedPaymentId(id);
  };
  
  const addPaymentMethod = (paymentMethod: Omit<PaymentMethod, 'id'>) => {
    const newId = `${paymentMethod.type}-${Date.now()}`;
    const newPaymentMethod = {
      ...paymentMethod,
      id: newId,
    };
    
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    return newId;
  };
  
  const removePaymentMethod = (id: string) => {
    const isRemovingDefault = paymentMethods.find(pm => pm.id === id)?.isDefault;
    let updatedMethods = paymentMethods.filter(pm => pm.id !== id);
    
    // If removing default, set a new default
    if (isRemovingDefault && updatedMethods.length > 0) {
      updatedMethods = updatedMethods.map((pm, idx) => ({
        ...pm,
        isDefault: idx === 0
      }));
      setSelectedPaymentId(updatedMethods[0].id);
    }
    
    setPaymentMethods(updatedMethods);
  };
  
  return {
    paymentMethods,
    selectedPaymentId,
    setSelectedPaymentId,
    setDefaultPaymentMethod,
    addPaymentMethod,
    removePaymentMethod
  };
}
