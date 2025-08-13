import { createClient } from '../utils/supabase/client';
import { createSupabaseAppServerClient } from '../utils/supabase/server';
import { Request, CancellationRequest } from '../utils/supabase/tables';

export interface CreateRequestData {
  request_id: string;
  request_type: string;
  status: string;
  metadata?: Record<string, any>;
  image_url?: string;
}

export interface RequestService {
  // Request management
  createRequest(userId: string, requestData: CreateRequestData): Promise<Request>;
  getRequestStatus(requestId: string): Promise<string | null>;
  updateRequestStatus(requestId: string, status: string, metadata?: Record<string, any>): Promise<Request>;
  
  // Cancellation management  
  createCancellationRequest(userId: string, requestId: string): Promise<CancellationRequest>;
  isCancellationRequested(requestId: string): Promise<boolean>;
}

class RequestServiceImpl implements RequestService {
  
  /**
   * Create a new request record in the database
   */
  async createRequest(userId: string, requestData: CreateRequestData): Promise<Request> {
    const supabase = createClient();
    
    const requestRecord = {
      user_id: userId,
      request_id: requestData.request_id,
      request_type: requestData.request_type,
      status: requestData.status,
      metadata: requestData.metadata || {},
      image_url: requestData.image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('requests')
      .insert(requestRecord)
      .select()
      .single();

    if (error) {
      console.error('Error creating request:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get the current status of a request
   */
  async getRequestStatus(requestId: string): Promise<string | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('requests')
      .select('status')
      .eq('request_id', requestId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - request not found
        return null;
      }
      console.error('Error getting request status:', error);
      throw error;
    }

    return data?.status || null;
  }

  /**
   * Update the status of an existing request
   */
  async updateRequestStatus(
    requestId: string, 
    status: string, 
    metadata?: Record<string, any>
  ): Promise<Request> {
    const supabase = createClient();

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (metadata) {
      updateData.metadata = metadata;
    }

    const { data, error } = await supabase
      .from('requests')
      .update(updateData)
      .eq('request_id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating request status:', error);
      throw error;
    }

    return data;
  }

  /**
   * Create a cancellation request
   */
  async createCancellationRequest(userId: string, requestId: string): Promise<CancellationRequest> {
    const supabase = createClient();

    const cancellationRecord = {
      user_id: userId,
      request_id: requestId,
      request_type: 'chat',
      status: 'pending',
      metadata: { cancelled_at: new Date().toISOString() },
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('cancellation_requests')
      .insert(cancellationRecord)
      .select()
      .single();

    if (error) {
      console.error('Error creating cancellation request:', error);
      throw error;
    }

    return data;
  }

  /**
   * Check if a cancellation has been requested for a specific request
   */
  async isCancellationRequested(requestId: string): Promise<boolean> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('cancellation_requests')
      .select('id')
      .eq('request_id', requestId)
      .eq('status', 'pending')
      .limit(1);

    if (error) {
      console.error('Error checking cancellation request:', error);
      throw error;
    }

    return (data?.length || 0) > 0;
  }
}

// Server-side version for API routes
export class ServerRequestService implements RequestService {
  
  async createRequest(userId: string, requestData: CreateRequestData): Promise<Request> {
    const supabase = await createSupabaseAppServerClient();
    
    const requestRecord = {
      user_id: userId,
      request_id: requestData.request_id,
      request_type: requestData.request_type,
      status: requestData.status,
      metadata: requestData.metadata || {},
      image_url: requestData.image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('requests')
      .insert(requestRecord)
      .select()
      .single();

    if (error) {
      console.error('Error creating request:', error);
      throw error;
    }

    return data;
  }

  async getRequestStatus(requestId: string): Promise<string | null> {
    const supabase = await createSupabaseAppServerClient();

    const { data, error } = await supabase
      .from('requests')
      .select('status')
      .eq('request_id', requestId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error getting request status:', error);
      throw error;
    }

    return data?.status || null;
  }

  async updateRequestStatus(
    requestId: string, 
    status: string, 
    metadata?: Record<string, any>
  ): Promise<Request> {
    const supabase = await createSupabaseAppServerClient();

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (metadata) {
      updateData.metadata = metadata;
    }

    const { data, error } = await supabase
      .from('requests')
      .update(updateData)
      .eq('request_id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating request status:', error);
      throw error;
    }

    return data;
  }

  async createCancellationRequest(userId: string, requestId: string): Promise<CancellationRequest> {
    const supabase = await createSupabaseAppServerClient();

    const cancellationRecord = {
      user_id: userId,
      request_id: requestId,
      request_type: 'chat',
      status: 'pending',
      metadata: { cancelled_at: new Date().toISOString() },
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('cancellation_requests')
      .insert(cancellationRecord)
      .select()
      .single();

    if (error) {
      console.error('Error creating cancellation request:', error);
      throw error;
    }

    return data;
  }

  async isCancellationRequested(requestId: string): Promise<boolean> {
    const supabase = await createSupabaseAppServerClient();

    const { data, error } = await supabase
      .from('cancellation_requests')
      .select('id')
      .eq('request_id', requestId)
      .eq('status', 'pending')
      .limit(1);

    if (error) {
      console.error('Error checking cancellation request:', error);
      throw error;
    }

    return (data?.length || 0) > 0;
  }
}

// Export singleton instances
export const requestService = new RequestServiceImpl();
export const serverRequestService = new ServerRequestService();