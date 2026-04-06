import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { RecentActivity } from '@/components/recent-activity';
import { ActivityItem } from '@/types/api';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const baseItem: ActivityItem = {
  id: 'act_001',
  type: 'deposit',
  amount: 150000,
  currency: 'GBP',
  date: '2026-04-05T16:54:33.315Z',
  description: 'Payment from Customer ABC',
  status: 'completed',
};

const mockItems: ActivityItem[] = [
  baseItem,
  { ...baseItem, id: 'act_002', description: 'Payment from Customer XYZ' },
  { ...baseItem, id: 'act_003', description: 'Payment from Customer DEF' },
];

describe('RecentActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all items', () => {
    const { getByText } = render(<RecentActivity items={mockItems} />);
    expect(getByText('Payment from Customer ABC')).toBeTruthy();
    expect(getByText('Payment from Customer XYZ')).toBeTruthy();
    expect(getByText('Payment from Customer DEF')).toBeTruthy();
  });

  it('renders the show more button', () => {
    const { getByLabelText } = render(<RecentActivity items={mockItems} />);
    expect(getByLabelText('Show all transactions')).toBeTruthy();
  });

  it('navigates to modal when show more is pressed', () => {
    const { getByLabelText } = render(<RecentActivity items={mockItems} />);
    fireEvent.press(getByLabelText('Show all transactions'));
    expect(mockPush).toHaveBeenCalledWith('/modal');
  });

  it('renders empty state message when no items', () => {
    const { getByText } = render(<RecentActivity items={[]} />);
    expect(getByText('No recent activity')).toBeTruthy();
  });

  it('renders empty list without crashing', () => {
    const { queryByLabelText } = render(<RecentActivity items={[]} />);
    expect(queryByLabelText('Show all transactions')).toBeTruthy();
  });

  it('renders the correct number of items', () => {
    const { getAllByText } = render(<RecentActivity items={mockItems} />);
    expect(getAllByText(/Payment from Customer/).length).toBe(3);
  });
});
