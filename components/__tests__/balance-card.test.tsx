import React from 'react';
import { render } from '@testing-library/react-native';

import { BalanceCard } from '@/components/balance-card';

describe('BalanceCard', () => {
  it('renders the account balance label', () => {
    const { getByText } = render(<BalanceCard balance={500_000} pending={25_000} currency="GBP" />);
    expect(getByText('Account Balance')).toBeTruthy();
  });

  it('renders the formatted available balance', () => {
    const { getByText } = render(<BalanceCard balance={500_000} pending={25_000} currency="GBP" />);
    expect(getByText('£5,000.00')).toBeTruthy();
  });

  it('renders the formatted pending balance', () => {
    const { getByText } = render(<BalanceCard balance={500_000} pending={25_000} currency="GBP" />);
    expect(getByText('£250.00')).toBeTruthy();
  });

  it('renders the pending label', () => {
    const { getByText } = render(<BalanceCard balance={500_000} pending={25_000} currency="GBP" />);
    expect(getByText('Pending')).toBeTruthy();
  });

  it('renders EUR amounts with correct symbol', () => {
    const { getByText } = render(<BalanceCard balance={500_000} pending={25_000} currency="EUR" />);
    expect(getByText('€5,000.00')).toBeTruthy();
    expect(getByText('€250.00')).toBeTruthy();
  });

  it('renders zero balance correctly', () => {
    const { getByText } = render(<BalanceCard balance={0} pending={25_000} currency="GBP" />);
    expect(getByText('£0.00')).toBeTruthy();
  });
});
