import { useState } from 'react'

import SectionTitle from '@/components/section-title'
import TaskManagementForm from '@/components/task-management-form'
import { useQuery } from '@tanstack/react-query'

import TaskList from './components/task-list'
import { getCompletedTasks } from './data-access/get-completed-tasks'
import { getOngoingTasks } from './data-access/get-ongoing-tasks'

function App() {
  const [updatedId, setUpdatedId] = useState<number | null>(null)

  const {
    data: onGoingData,
    isPending: onGoingPending,
    refetch: refetchOnGoingData,
  } = useQuery({
    initialData: [],
    queryKey: ['ongoing-tasks'],
    queryFn: async () => {
      const res = await getOngoingTasks()

      return res.data
    },
  })

  const {
    data: completedData,
    isPending: completedPending,
    refetch: refetchCompletedData,
  } = useQuery({
    initialData: [],
    queryKey: ['completed-tasks'],
    queryFn: async () => {
      const res = await getCompletedTasks()

      return res.data
    },
  })

  return (
    <body className="font-poppins">
      <main className="p-3">
        <div className="mx-auto flex max-w-[580px] flex-col space-y-4">
          <SectionTitle className="text-center" title="Task Management" />

          <section id="input-form">
            <TaskManagementForm
              updatedId={updatedId}
              setUpdatedId={setUpdatedId}
              onGoingRefetch={refetchOnGoingData}
              onCompleteRefetch={refetchCompletedData}
            />
          </section>

          {onGoingData.length > 0 && (
            <section id="ongoing-task">
              <TaskList
                data={onGoingData}
                isLoading={onGoingPending}
                setUpdatedId={setUpdatedId}
                onGoingRefetch={refetchOnGoingData}
                onCompleteRefetch={refetchCompletedData}
                type="ongoing"
              />
            </section>
          )}

          {completedData.length > 0 && (
            <section id="completed-task">
              <TaskList
                data={completedData}
                isLoading={completedPending}
                setUpdatedId={setUpdatedId}
                onCompleteRefetch={refetchCompletedData}
                type="completed"
              />
            </section>
          )}
        </div>
      </main>
    </body>
  )
}

export default App
