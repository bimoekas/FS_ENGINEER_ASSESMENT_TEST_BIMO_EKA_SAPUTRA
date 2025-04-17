import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  CheckCircle2Icon,
  CircleXIcon,
  Loader2,
  PencilIcon,
} from 'lucide-react'
import { useState } from 'react'

import Alert from '@/components/alert'
import { deleteTask } from '@/data-access/delete-task'
import { updateCompleteTask } from '@/data-access/update-complete-task'
import { cn } from '@/lib/utils'
import { Task } from '@/types/api/TaskInfo'
import { AlertMessage } from '@/types/entities/alert-message'
import { ServerResponse } from '@/types/entities/server-response'
import { useMutation } from '@tanstack/react-query'

interface TaskListProps {
  className?: string
  type: 'ongoing' | 'completed'
  data: Task[]
  isLoading: boolean
  setUpdatedId: (value: number | null) => void
  onGoingRefetch?: () => void
  onCompleteRefetch?: () => void
}

const TaskList = ({
  data,
  type,
  isLoading,
  className,
  onGoingRefetch,
  onCompleteRefetch,
  setUpdatedId,
}: TaskListProps) => {
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({
    show: false,
    message: '',
    type: null,
  })

  const { mutate: handleDelete } = useMutation({
    mutationKey: ['tasks', 'delete'],
    mutationFn: async (id: number) => {
      return deleteTask(id)
    },
    onSuccess: (data: ServerResponse<Task>) => {
      setAlertMessage({
        show: true,
        message: data.message,
        type: 'success',
      })
      if (onGoingRefetch) onGoingRefetch()
      if (onCompleteRefetch) onCompleteRefetch()
    },
    onError: err => {
      setAlertMessage({
        show: true,
        message: err.message,
        type: 'error',
      })
    },
  })

  const { mutate: handleComplete } = useMutation({
    mutationKey: ['tasks', 'complete'],
    mutationFn: async (id: number) => {
      return updateCompleteTask(id)
    },
    onSuccess: (data: ServerResponse<Task>) => {
      setAlertMessage({
        show: true,
        message: data.message,
        type: 'success',
      })
      if (onCompleteRefetch) onCompleteRefetch()
      if (onGoingRefetch) onGoingRefetch()
    },
    //onSettled: () => {
    //  if (onCompleteRefetch) onCompleteRefetch()
    //  if (onGoingRefetch) onGoingRefetch()
    //},
    onError: err => {
      setAlertMessage({
        show: true,
        message: err.message,
        type: 'error',
      })
    },
  })

  return (
    <div className={cn(className)}>
      <p className="text-base font-bold">
        {type === 'ongoing' ? 'Ongoing Task' : 'Completed Task'}
      </p>

      {isLoading && <Loader2 className="animate-spin" />}

      {!isLoading && (
        <div className="mt-2 space-y-2">
          {data.map(item => (
            <div
              className="flex w-full items-center justify-between rounded-md bg-[#D0D0D0] p-4"
              key={item.id}>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <p
                    className={cn(
                      'text-base',
                      item.is_complete && 'line-through',
                    )}>
                    {item.title}
                  </p>
                  <PencilIcon
                    onClick={() => {
                      setUpdatedId(item.id)
                    }}
                    className="hover:cursor-pointer"
                    size={15}
                  />
                </div>
                <p className="text-xs">
                  {format(
                    item.is_complete ? item.updated_at : item.created_at,
                    'dd MMMM yyyy HH:mm',
                    {
                      locale: id,
                    },
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <CircleXIcon
                  onClick={() => handleDelete(item.id)}
                  size={15}
                  className="hover:cursor-pointer"
                />
                {type === 'ongoing' && (
                  <input
                    type="radio"
                    name={`task-radio-${item.title}`}
                    className="h-4 w-4 border-black bg-white hover:cursor-pointer"
                    onChange={() => handleComplete(item.id)}
                  />
                )}

                {type === 'completed' && <CheckCircle2Icon size={15} />}
              </div>
            </div>
          ))}
        </div>
      )}
      {alertMessage.show && (
        <Alert alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
      )}
    </div>
  )
}

export default TaskList
