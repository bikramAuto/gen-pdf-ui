import { apiClient, RequestOptions } from './client';

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
  data: DocumentPayload,
  options: RequestOptions = {}
): Promise<DocumentResponse> => {
  return apiClient<DocumentResponse>(`/documents/create/${id}`, {
    ...options,
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
  data: DocumentPayload,
  options: RequestOptions = {}
): Promise<DocumentResponse> => {
  return apiClient<DocumentResponse>(
    `/documents/update/${userId}?docId=${docId}`,
    {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
};

export interface DocumentListItem {
  id: string;
  title: string;
}

export interface PaginatedDocuments {
  data: DocumentListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface FullDocument extends SavedDocument {
  template?: {
    id: string;
    name: string;
    userId: string;
    layout: Record<string, any>;
  };
}

/**
 * GET /documents/getDoc/:id
 * Fetches document list or a specific document (if docId provided) for a user.
 * 
 * @param userId - The user ID (route param)
 * @param docId  - (Optional) specific document ID (query param)
 * @param page   - (Optional) page number (for list)
 * @param limit  - (Optional) items per page (for list)
 */
export const getDocuments = async (
  userId: string,
  docId?: string,
  page: number = 1,
  limit: number = 10,
  options: RequestOptions = {}
): Promise<PaginatedDocuments | FullDocument[]> => {
  let url = `/documents/getDoc/${userId}?page=${page}&limit=${limit}`;
  if (docId) {
    url += `&docId=${docId}`;
  }
  return apiClient<PaginatedDocuments | FullDocument[]>(url, {
    ...options,
    method: 'GET',
  });
};
