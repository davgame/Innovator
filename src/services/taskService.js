import { supabase } from '@/lib/supabase'

// Получить задачи проекта
export const fetchTasks = async (projectId) => {
  return await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('id')
}

// Обновить задачу
export const updateTaskDB = async (task) => {
  return await supabase
    .from('tasks')
    .update(task)
    .eq('id', task.id)
}

// Удалить задачу
export const deleteTaskDB = async (id) => {
  return await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
}

// Обновить статус (drag & drop)
export const updateTaskStatus = async (id, status) => {
  return await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
}

// Обновить дедлайн
export const updateTaskDeadline = async (id, deadline) => {
  return await supabase
    .from('tasks')
    .update({ deadline })
    .eq('id', id)
}

// Создать новую задачу
export const createTaskDB = async (task) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
  return { data, error }
}
