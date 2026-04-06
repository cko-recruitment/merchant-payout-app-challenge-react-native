import React from 'react';
import { render } from '@testing-library/react-native';

import { ActivityRow } from '@/components/activity-row';
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

describe('ActivityRow', () => {
  it('renders the description', () => {
    const { getByText } = render(<ActivityRow {...baseItem} />);
    expect(getByText('Payment from Customer ABC')).toBeTruthy();
  });

  it('renders a positive amount in green', () => {
    const { getByText } = render(<ActivityRow {...baseItem} />);
    const amountText = getByText('£1,500.00');
    expect(amountText.props.style).toEqual(expect.arrayContaining([{ color: '#10B981' }]));
  });

  it('renders a negative amount in red', () => {
    const { getByText } = render(<ActivityRow {...baseItem} amount={-50000} type="payout" />);
    const amountText = getByText('£-500.00');
    expect(amountText.props.style).toEqual(expect.arrayContaining([{ color: '#EF4444' }]));
  });

  it('renders EUR amounts with correct symbol', () => {
    const { getByText } = render(<ActivityRow {...baseItem} currency="EUR" />);
    expect(getByText('€1,500.00')).toBeTruthy();
  });

  it('renders zero amount', () => {
    const { getByText } = render(<ActivityRow {...baseItem} amount={0} />);
    expect(getByText('£0.00')).toBeTruthy();
  });
});
