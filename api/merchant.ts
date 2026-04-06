import {
  CreatePayoutRequest,
  MerchantDataResponse,
  PaginatedActivityResponse,
  PayoutResponse,
} from '@/types/api';
import { API_BASE_URL } from '@/constants';

export async function fetchMerchantData(): Promise<MerchantDataResponse> {
  const url = `${API_BASE_URL}/api/merchant`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch merchant data');
  }

  return response.json();
}

export async function fetchMerchantActivity(cursor?: string): Promise<PaginatedActivityResponse> {
  const params = new URLSearchParams({ limit: '15' });
  if (cursor) params.set('cursor', cursor);
  const response = await fetch(`${API_BASE_URL}/api/merchant/activity?${params}`);
  if (!response.ok) throw new Error(`Failed to fetch activity: ${response.status}`);
  return response.json();
}

export async function createPayout(payload: CreatePayoutRequest): Promise<PayoutResponse> {
  const response = await fetch(`${API_BASE_URL}/api/payouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { status: response.status, ...error };
  }

  return response.json();
}
