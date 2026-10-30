import { useQuery, useMutation } from "@tanstack/react-query";
import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export * from "./generated/api.schemas";
export { setBaseUrl, setAuthTokenGetter } from "./custom-fetch";
export type { AuthTokenGetter } from "./custom-fetch";

// Health endpoints
export const getHealthCheckUrl = () => `/api/healthz`;
export const getHealthCheckQueryKey = () => [`/api/healthz`] as const;
export function useHealthCheck(options?: any) {
  return useQuery<any>({
    queryKey: getHealthCheckQueryKey(),
    queryFn: () => customFetch<any>(getHealthCheckUrl(), { method: "GET" }),
    ...options?.query,
  });
}

export const getGetSystemHealthUrl = () => `/api/health`;
export const getGetSystemHealthQueryKey = () => [`/api/health`] as const;
export function useGetSystemHealth(options?: any) {
  return useQuery<any>({
    queryKey: getGetSystemHealthQueryKey(),
    queryFn: () => customFetch<any>(getGetSystemHealthUrl(), { method: "GET" }),
    ...options?.query,
  });
}

// Model Status & Metrics
export const getGetModelStatusUrl = () => `/api/model/status`;
export const getGetModelStatusQueryKey = () => [`/api/model/status`] as const;
export function useGetModelStatus(options?: any) {
  return useQuery<any>({
    queryKey: getGetModelStatusQueryKey(),
    queryFn: () => customFetch<any>(getGetModelStatusUrl(), { method: "GET" }),
    ...options?.query,
  });
}

export const getGetModelMetricsUrl = () => `/api/model/metrics`;
export const getGetModelMetricsQueryKey = () => [`/api/model/metrics`] as const;
export function useGetModelMetrics(options?: any) {
  return useQuery<any>({
    queryKey: getGetModelMetricsQueryKey(),
    queryFn: () => customFetch<any>(getGetModelMetricsUrl(), { method: "GET" }),
    ...options?.query,
  });
}

// Analytics
export const getGetAnalyticsUrl = () => `/api/analytics`;
export const getGetAnalyticsQueryKey = () => [`/api/analytics`] as const;
export function useGetAnalytics(options?: any) {
  return useQuery<any>({
    queryKey: getGetAnalyticsQueryKey(),
    queryFn: () => customFetch<any>(getGetAnalyticsUrl(), { method: "GET" }),
    ...options?.query,
  });
}

// Predictions List
export const getListPredictionsUrl = (params?: { search?: string; predicted_class?: string; sort?: string; order?: string }) => {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.predicted_class) q.set("predicted_class", params.predicted_class);
  if (params?.sort) q.set("sort", params.sort);
  if (params?.order) q.set("order", params.order);
  const qs = q.toString();
  return `/api/predictions${qs ? `?${qs}` : ""}`;
};
export const getListPredictionsQueryKey = (params?: any) => [`/api/predictions`, params] as const;
export function useListPredictions(params?: any, options?: any) {
  return useQuery<any>({
    queryKey: getListPredictionsQueryKey(params),
    queryFn: () => customFetch<any[]>(getListPredictionsUrl(params), { method: "GET" }),
    ...options?.query,
  });
}

// Prediction Mutation (Upload MRI Image)
export function useCreatePrediction(options?: UseMutationOptions<any, Error, { data: { file: any } }>) {
  return useMutation({
    mutationFn: async ({ data }: { data: { file: any } }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        let errDetail = "Prediction request failed.";
        try {
          const json = await res.json();
          errDetail = json.detail || json.message || errDetail;
        } catch {
          errDetail = await res.text();
        }
        throw new Error(errDetail);
      }
      return res.json();
    },
    ...options,
  });
}

// Delete Prediction
export function useDeletePrediction(options?: UseMutationOptions<any, Error, any>) {
  return useMutation({
    mutationFn: async (params: { id?: string; predictionId?: string }) => {
      const targetId = params.id || params.predictionId;
      const res = await fetch(`/api/predictions/${targetId}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error(`Failed to delete prediction with ID: ${targetId}`);
      }
      return true;
    },
    ...options,
  });
}
