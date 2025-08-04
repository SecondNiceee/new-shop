import { isRequestError } from "./isRequestError";

// === Типы ===
export interface RequestError {
  status?: number;
  message: string;
}

// === Конфиг ===
const PAYLOAD_URL = process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:3000';

// === Интерфейс запроса ===
interface IRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  query?: Record<string, string>;
  body?: Record<string, any>;
  credentials?: boolean;
  headers?: Record<string, string>;
}

// === Основная функция запроса ===
export const request = async ({
  url,
  method,
  body,
  query,
  credentials = false,
  headers = {},
}: IRequest): Promise<any> => {
  // Собираем URL
  const baseUrl = url.startsWith('http') ? url : `${PAYLOAD_URL}${url}`;
  const finalUrl = query
    ? `${baseUrl}?${new URLSearchParams(query)}`
    : baseUrl;

  // GET-запросы не должны иметь тела
  if (method === 'GET' && body) {
    console.warn('GET requests should not have a body. Ignoring body.');
  }

  try {
    const response = await fetch(finalUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: method === 'GET' ? undefined : JSON.stringify(body),
      credentials: credentials ? 'include' : 'omit',
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      const error: RequestError = {
        status: response.status,
        message: errorData?.message || response.statusText || 'Request failed',
      };

      throw error;
    }

    return await response.json();
  } catch (e) {
    // Если это уже RequestError — пробрасываем дальше
    if (isRequestError(e)) {
      throw e;
    }

    // Все остальные ошибки — превращаем в Internal Server Error
    const internalError: RequestError = {
      status: 500,
      message: 'Internal server error',
    };

    console.error('Network or unexpected error:', e);
    throw internalError;
  }
};