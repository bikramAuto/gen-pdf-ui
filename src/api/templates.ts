import { apiClient, RequestOptions } from './client';

export interface TemplatePayload {
  name?: string;
  layout: Record<string, any>;
}

export interface TemplateResponse {
  statusCode: number;
  Message: string;
  id: string | null;
}

export const createTemplate = async (id: string, data: TemplatePayload, options: RequestOptions = {}): Promise<TemplateResponse> => {
  return apiClient<TemplateResponse>(`/preferences/create/${id}`, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateTemplate = async (
  userId: string,
  prefId: string,
  data: TemplatePayload,
  options: RequestOptions = {}
): Promise<TemplateResponse> => {
  return apiClient<TemplateResponse>(
    `/preferences/update/${userId}?prefId=${prefId}`,
    {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
};

export interface SavedTemplate {
  id: string;
  name?: string;
  userId: string;
  layout: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateListItem {
  id: string;
  name: string;
}

export interface PaginatedTemplates {
  data: TemplateListItem[];
  total: number;
  page: number;
  limit: number;
}

// Get all templates for a user (paginated)
export const getTemplates = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  options: RequestOptions = {}
): Promise<PaginatedTemplates> => {
  return apiClient<PaginatedTemplates>(
    `/preferences/getPref/${userId}?page=${page}&limit=${limit}`,
    { ...options, method: 'GET' }
  );
};

// Get a specific template by templateId
export const getTemplateById = async (
  userId: string,
  templateId: string,
  options: RequestOptions = {}
): Promise<SavedTemplate> => {
  return apiClient<SavedTemplate>(
    `/preferences/getPref/${userId}?prefId=${templateId}`,
    { ...options, method: 'GET' }
  );
};
