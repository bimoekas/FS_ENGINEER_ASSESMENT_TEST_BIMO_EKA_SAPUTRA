import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Alert from '@/components/alert'
import Button from '@/components/button'
import InputError from '@/components/input-error'
import { showTask } from '@/data-access/show-task'
import { storeTask } from '@/data-access/store-task'
import { updateTask } from '@/data-access/update-task'
import { cn } from '@/lib/utils'
import { Task } from '@/types/api/TaskInfo'
import { AlertMessage } from '@/types/entities/alert-message'
import { ServerResponse } from '@/types/entities/server-response'
import { TaskForm, TaskFormSchema } from '@/types/form/Task'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'

interface TaskManagementForm {
  className?: string
  updatedId: number | null
  setUpdatedId: (value: number | null) => void
  onGoingRefetch?: () => void
  onCompleteRefetch?: () => void
}

const TaskManagementForm = ({
  className,
  updatedId,
  setUpdatedId,
  onGoingRefetch,
  onCompleteRefetch,
}: TaskManagementForm) => {
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({
    show: false,
    message: '',
    type: null,
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<TaskForm>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: '',
    },
  })

  const { data, isPending: taskPending } = useQuery({
    queryKey: ['tasks', updatedId],
    queryFn: async () => {
      if (!updatedId) return

      const res = await showTask(updatedId)

      return res.data
    },
    enabled: Boolean(updatedId),
  })

  const { mutate: add, isPending: addPending } = useMutation({
    mutationKey: ['tasks'],
    mutationFn: async (values: TaskForm) => {
      return storeTask(values)
    },
    onSuccess: (data: ServerResponse<Task>) => {
      setAlertMessage({
        show: true,
        message: data.message,
        type: 'success',
      })
      if (onGoingRefetch) onGoingRefetch()
    },
    onError: err => {
      setAlertMessage({
        show: true,
        message: err.message,
        type: 'error',
      })
    },
  })

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationKey: ['tasks', updatedId],
    mutationFn: async (values: TaskForm) => {
      if (!updatedId) throw new Error('Task didnt found!')

      return updateTask(updatedId, values)
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

  const onSubmit = async (data: TaskForm) => {
    if (updatedId) {
      update(data)
    } else {
      add(data)
    }

    reset({ title: '' })
    setUpdatedId(null)
  }

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
      })
    }
  }, [data, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(className)}>
      <div>
        <label htmlFor="title" className="text-base">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="border-0.5 mt-1 block w-full rounded-[10px] border border-black px-3 py-2"
        />
        {errors.title && <InputError message={errors.title.message} />}
      </div>

      <div className="flex items-center justify-center">
        {!updatedId && (
          <Button
            type="submit"
            bgClassName="bg-[#6FCBFF]"
            title="Add Task"
            className="mt-4 w-fit bg-[#6FCBFF] text-black hover:bg-blue-400"
            isLoading={addPending}
            disabled={addPending}
          />
        )}

        {updatedId && (
          <div className="flex space-x-4">
            <Button
              type="submit"
              bgClassName="bg-[#FFB46F]"
              title="Update Task"
              className="mt-4 w-fit bg-[#FFB46F] text-black hover:bg-orange-400"
              isLoading={taskPending || updatePending}
              disabled={taskPending || updatePending}
            />
            <Button
              type="submit"
              bgClassName="bg-[#FF6F6F]"
              title="Cancel"
              className="mt-4 w-fit bg-[#FF6F6F] text-black hover:bg-red-500"
              onClick={() => {
                reset({ title: '' })
                setUpdatedId(null)
              }}
              isLoading={taskPending || updatePending}
              disabled={taskPending || updatePending}
            />
          </div>
        )}
      </div>
      {alertMessage.show && (
        <Alert alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
      )}
    </form>
  )
}

export default TaskManagementForm
