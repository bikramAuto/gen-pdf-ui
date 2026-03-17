import { apiClient } from './client';

export interface TemplatePayload {
  userId: string;
  name?: string;
  layout: Record<string, any>;
}

export interface TemplateResponse {
  statusCode: number;
  Message: string;
  id: string | null;
}

export const createTemplate = async (id: string, data: TemplatePayload): Promise<TemplateResponse> => {
  return apiClient<TemplateResponse>(`/preferences/create/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateTemplate = async (id: string, data: TemplatePayload): Promise<TemplateResponse> => {
  return apiClient<TemplateResponse>(`/preferences/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export interface SavedTemplate {
  id: string;
  name?: string;
  userId: string;
  layout: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedTemplates {
  data: SavedTemplate[];
  total?: number;
  page?: number;
  limit?: number;
}

// Get all templates for a user (paginated)
export const getTemplates = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedTemplates> => {
  return apiClient<PaginatedTemplates>(
    `/preferences/getPref/${userId}?page=${page}&limit=${limit}`,
    { method: 'GET' }
  );
};

// Get a specific template by templateId
export const getTemplateById = async (
  userId: string,
  templateId: string
): Promise<SavedTemplate> => {
  return apiClient<SavedTemplate>(
    `/preferences/getPref/${userId}?prefId=${templateId}`,
    { method: 'GET' }
  );
};
