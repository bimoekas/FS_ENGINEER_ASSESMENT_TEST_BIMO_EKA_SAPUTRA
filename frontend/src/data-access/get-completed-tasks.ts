import { ofetch } from 'ofetch';

import { Task } from '@/types/api/TaskInfo';
import { ServerResponse } from '@/types/entities/server-response';

export const getCompletedTasks = async () => {
  return ofetch<ServerResponse<Task[]>>(
    `${import.meta.env.VITE_API_URL}/tasks/completed`,
    {
      method: 'GET',
    },
  )
}
