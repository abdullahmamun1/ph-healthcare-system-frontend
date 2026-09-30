import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { ScheduleParams } from "@/types";
import {
  createSchedule,
  deleteSchedule,
  getMySchedules,
  publishSchedule,
} from "@/api";

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useMySchedules(params: ScheduleParams) {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getMySchedules(params),
  });
}

export function useSuspenseMySchedules(params: ScheduleParams) {
  return useSuspenseQuery({
    queryKey: ["schedules", params],
    queryFn: () => getMySchedules(params),
  });
}

export function usePublishSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}
