// src/shared/utils/request.ts

// === Типы ===
export interface RequestError {
  status?: number;
  message: string;
}

// Импорт type guard
import { isRequestError } from './isRequestError';

// === Конфиг ===


// === Интерфейс запроса ===
interface IRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  query?: Record<string, string>;
  body?: Record<string, any>;
  credentials?: boolean;
  headers?: Record<string, string>;
}

// === Основная функция запроса с дженериком ===
export const request = async <T,>({
  url,
  method,
  body,
  query,
  credentials = false,
  headers = {},
}: IRequest): Promise<T> => {
  // Собираем URL
  const finalUrl = query
    ? `${url}?${new URLSearchParams(query)}`
    : url;

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
      cache : "force-cache"
    });

    // Если ответ не успешный — парсим ошибку
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

    // Парсим успешный ответ
    const data: T = await response.json();
    return data;
  } catch (e) {
    // Если это уже RequestError — пробрасываем
    if (isRequestError(e)) {
      throw e;
    }
    // Все остальные — внутренняя ошибка
    const internalError: RequestError = {
      status: 500,
      message: 'Internal server error',
    };
    console.error('Network or unexpected error:', e);
    throw internalError;
  }
};