import { apiClient } from './client';

// ─── Enums & Types ──────────────────────────────────────────────────────────

export enum STATUS {
  DRAFT = 'DRAFT',
  FINAL = 'FINAL',
}

export interface DocumentPayload {
  userId: string;
  title: string;
  content: string;
  layoutId: string;
  status: STATUS;
}

export interface DocumentResponse {
  statusCode: number;
  message: string;
  id: string | null;
}

export interface SavedDocument {
  id: string;
  userId: string;
  title: string;
  content: string;
  layoutId: string;
  status: STATUS;
  createdAt?: string;
  updatedAt?: string;
}

// ─── API Calls ───────────────────────────────────────────────────────────────

/**
 * POST /documents/create/:id
 * Creates a new document for the given user.
 *
 * @param id   - The user ID (route param)
 * @param data - The document payload body
 */
export const createDocument = async (
  id: string,
  data: DocumentPayload
): Promise<DocumentResponse> => {
  return apiClient<DocumentResponse>(`/documents/create/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT /documents/update/:id
 * Updates an existing document identified by docId for the given user.
 *
 * @param userId - The user ID (route param)
 * @param docId  - The document ID (query param)
 * @param data   - The updated document payload body
 */
export const updateDocument = async (
  userId: string,
  docId: string,
  data: DocumentPayload
): Promise<DocumentResponse> => {
  return apiClient<DocumentResponse>(
    `/documents/update/${userId}?docId=${docId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
};
