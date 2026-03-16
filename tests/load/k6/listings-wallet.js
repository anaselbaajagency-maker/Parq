import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = __ENV.BASE_URL || 'http://127.0.0.1:8000';
const authToken = __ENV.AUTH_TOKEN || '';

export const options = {
  scenarios: {
    listings_read: {
      executor: 'ramping-arrival-rate',
      startRate: 5,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 80,
      stages: [
        { target: 20, duration: '2m' },
        { target: 50, duration: '5m' },
        { target: 20, duration: '2m' },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<600'],
    'http_req_duration{endpoint:listings_index}': ['p(95)<450'],
    'http_req_duration{endpoint:listings_show}': ['p(95)<500'],
    'http_req_duration{endpoint:wallet_balance}': ['p(95)<350'],
  },
};

const defaultHeaders = {
  Accept: 'application/json',
};

export default function () {
  const indexRes = http.get(`${baseUrl}/api/listings?per_page=15`, {
    tags: { endpoint: 'listings_index' },
    headers: defaultHeaders,
  });

  check(indexRes, {
    'listings index is 200': (r) => r.status === 200,
  });

  let listingId = 1;
  try {
    const body = indexRes.json();
    listingId = body?.data?.[0]?.id || listingId;
  } catch (_) {
    // Keep fallback listing ID.
  }

  const showRes = http.get(`${baseUrl}/api/listings/${listingId}`, {
    tags: { endpoint: 'listings_show' },
    headers: defaultHeaders,
  });

  check(showRes, {
    'listing details is 200': (r) => r.status === 200,
  });

  if (authToken) {
    const walletRes = http.get(`${baseUrl}/api/wallet/balance`, {
      tags: { endpoint: 'wallet_balance' },
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${authToken}`,
      },
    });

    check(walletRes, {
      'wallet balance status acceptable': (r) => r.status === 200 || r.status === 401 || r.status === 403,
    });
  }

  sleep(1);
}
