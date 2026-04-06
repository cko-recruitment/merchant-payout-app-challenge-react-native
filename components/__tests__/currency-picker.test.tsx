import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import { CurrencyPicker } from '@/components/currency-picker';

jest.mock('@gorhom/bottom-sheet', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { forwardRef } = require('react');

  const BottomSheetModal = forwardRef(({ children }: any, _ref: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View } = require('react-native');
    return <View>{children}</View>;
  });
  BottomSheetModal.displayName = 'BottomSheetModal';

  const BottomSheetView = ({ children }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View } = require('react-native');
    return <View>{children}</View>;
  };
  BottomSheetView.displayName = 'BottomSheetView';

  const BottomSheetBackdrop = () => null;
  BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';

  return { BottomSheetModal, BottomSheetView, BottomSheetBackdrop };
});

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View } = require('react-native');
    return <View />;
  },
}));

describe('CurrencyPicker', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the current currency value', () => {
    const { getByLabelText } = render(<CurrencyPicker value="GBP" onChange={onChange} />);
    expect(getByLabelText('Currency: GBP. Tap to change')).toBeTruthy();
  });

  it('renders both currency options', () => {
    const { getByLabelText } = render(<CurrencyPicker value="GBP" onChange={onChange} />);
    expect(getByLabelText('Currency: GBP. Tap to change')).toBeTruthy();
    expect(getByLabelText('EUR')).toBeTruthy();
  });

  it('calls onChange with selected currency', () => {
    const { getByLabelText } = render(<CurrencyPicker value="GBP" onChange={onChange} />);
    fireEvent.press(getByLabelText('EUR'));
    expect(onChange).toHaveBeenCalledWith('EUR');
  });

  it('marks the current value as selected', () => {
    const { getByLabelText } = render(<CurrencyPicker value="GBP" onChange={onChange} />);
    expect(getByLabelText('GBP').props.accessibilityState.selected).toBe(true);
    expect(getByLabelText('EUR').props.accessibilityState.selected).toBe(false);
  });

  it('renders EUR as selected when value is EUR', () => {
    const { getByLabelText } = render(<CurrencyPicker value="EUR" onChange={onChange} />);
    expect(getByLabelText('EUR').props.accessibilityState.selected).toBe(true);
    expect(getByLabelText('GBP').props.accessibilityState.selected).toBe(false);
  });
});
