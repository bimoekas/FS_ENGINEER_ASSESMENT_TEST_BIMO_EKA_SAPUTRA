import { ofetch } from 'ofetch';

import { Task } from '@/types/api/TaskInfo';
import { ServerResponse } from '@/types/entities/server-response';

export const deleteTask = async (id: number) => {
  return ofetch<ServerResponse<Task>>(
    `${import.meta.env.VITE_API_URL}/tasks/${id}`,
    {
      method: 'DELETE',
    },
  )
}
