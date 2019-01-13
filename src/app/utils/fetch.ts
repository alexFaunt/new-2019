import * as fetch from 'isomorphic-fetch';
import camelify from './camelify';

// Thrown when a request comes back that is not 20X to allow code checks
export class RequestError extends Error {
  status: number;
  body: any;

  constructor(message, status = 500, body) {
    super(message);
    this.status = status;
    this.body = body || null;
  }
}

const getBody = async (response) => {
  const { status, headers } = response;

  if (status === 204) {
    return null;
  }

  const contentType = headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

const wrappedFetch = async (url, init) => {
  const response = await fetch(url, init);

  const responseBody = await getBody(response);
  const { status, headers } = response;

  // Response was non successy - throw an error instead
  if (!response.ok) {
    const bodyMessage = responseBody ? responseBody.error || responseBody.message || responseBody : null;
    throw new RequestError(bodyMessage || 'Unknown Error', status, responseBody);
  }

  return { body: camelify(responseBody), status, headers };
};

export default wrappedFetch;
