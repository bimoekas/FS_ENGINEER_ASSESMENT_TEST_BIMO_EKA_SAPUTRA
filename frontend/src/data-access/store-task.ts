import { ofetch } from 'ofetch';

import { Task } from '@/types/api/TaskInfo';
import { TaskForm } from '@/types/form/Task';
import { ServerResponse } from '@/types/entities/server-response';

export const storeTask = async (formValues: TaskForm) => {
  return ofetch<ServerResponse<Task>>(`${import.meta.env.VITE_API_URL}/tasks`, {
    method: 'POST',
    body: formValues,
  })
}
