import React from 'react';
import { render } from '@testing-library/react-native';

import { TransactionRow } from '@/components/transaction-row';
import { ActivityItem } from '@/types/api';

const baseItem: ActivityItem = {
  id: 'act_001',
  type: 'deposit',
  amount: 150000,
  currency: 'GBP',
  date: '2026-04-05T16:54:33.315Z',
  description: 'Payment from Customer ABC',
  status: 'completed',
};

describe('TransactionRow', () => {
  it('renders the description', () => {
    const { getByText } = render(<TransactionRow item={baseItem} />);
    expect(getByText('Payment from Customer ABC')).toBeTruthy();
  });

  it('renders the transaction type', () => {
    const { getByText } = render(<TransactionRow item={baseItem} />);
    expect(getByText('deposit')).toBeTruthy();
  });

  it('renders the status', () => {
    const { getByText } = render(<TransactionRow item={baseItem} />);
    expect(getByText('completed')).toBeTruthy();
  });

  it('renders the formatted date', () => {
    const { getByText } = render(<TransactionRow item={baseItem} />);
    expect(getByText('5 Apr 2026')).toBeTruthy();
  });

  it('renders a positive amount in green', () => {
    const { getByText } = render(<TransactionRow item={baseItem} />);
    const amountText = getByText('£1,500.00');
    expect(amountText.props.style).toEqual(expect.arrayContaining([{ color: '#10B981' }]));
  });

  it('renders a negative amount in red', () => {
    const { getByText } = render(
      <TransactionRow item={{ ...baseItem, amount: -50000, type: 'payout' }} />,
    );
    const amountText = getByText('£-500.00');
    expect(amountText.props.style).toEqual(expect.arrayContaining([{ color: '#EF4444' }]));
  });

  it('renders EUR amounts with correct symbol', () => {
    const { getByText } = render(<TransactionRow item={{ ...baseItem, currency: 'EUR' }} />);
    expect(getByText('€1,500.00')).toBeTruthy();
  });

  it('renders payout type correctly', () => {
    const { getByText } = render(<TransactionRow item={{ ...baseItem, type: 'payout' }} />);
    expect(getByText('payout')).toBeTruthy();
  });
});
