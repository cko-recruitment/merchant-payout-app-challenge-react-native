import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import { PayoutConfirmationSheet } from '@/components/payout-confirmation-sheet';

jest.mock('@gorhom/bottom-sheet', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { forwardRef } = require('react');

  const BottomSheetModal = forwardRef(({ children }: any, _ref: any) => <View>{children}</View>);
  BottomSheetModal.displayName = 'BottomSheetModal';

  const BottomSheetView = ({ children }: any) => <View>{children}</View>;
  BottomSheetView.displayName = 'BottomSheetView';

  const BottomSheetBackdrop = () => null;
  BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';

  return { BottomSheetModal, BottomSheetView, BottomSheetBackdrop };
});

const defaultProps = {
  visible: true,
  amount: '400',
  currency: 'GBP' as const,
  iban: 'GB29NWBK60161331926819',
  isSubmitting: false,
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

describe('PayoutConfirmationSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the formatted amount', () => {
    const { getByText } = render(<PayoutConfirmationSheet {...defaultProps} />);
    expect(getByText('£400.00')).toBeTruthy();
  });

  it('renders the currency', () => {
    const { getByText } = render(<PayoutConfirmationSheet {...defaultProps} />);
    expect(getByText('GBP')).toBeTruthy();
  });

  it('renders the masked IBAN', () => {
    const { getByText } = render(<PayoutConfirmationSheet {...defaultProps} />);
    expect(getByText('GB29**************6819')).toBeTruthy();
  });

  it('calls onConfirm when confirm button is pressed', () => {
    const { getByLabelText } = render(<PayoutConfirmationSheet {...defaultProps} />);
    fireEvent.press(getByLabelText('Confirm payout'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is pressed', () => {
    const { getByLabelText } = render(<PayoutConfirmationSheet {...defaultProps} />);
    fireEvent.press(getByLabelText('Cancel payout'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows Processing... when isSubmitting is true', () => {
    const { getByText } = render(<PayoutConfirmationSheet {...defaultProps} isSubmitting={true} />);
    expect(getByText('Processing...')).toBeTruthy();
  });

  it('disables buttons when isSubmitting is true', () => {
    const { getByLabelText } = render(
      <PayoutConfirmationSheet {...defaultProps} isSubmitting={true} />,
    );
    fireEvent.press(getByLabelText('Confirm payout'));
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });
});
