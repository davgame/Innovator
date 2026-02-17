// store/useProjectStore.js
import { ref } from 'vue'

// Глобальное состояние для участников задач
const taskMembers = ref({
  1: [], // UX/UI дизайн
  2: [], // BPMN схема
  3: []  // API интеграция
})

export function useProjectStore() {
  const getTaskMembers = (taskId) => {
    return taskMembers.value[taskId] || []
  }

  const addMembersToTask = (taskId, selectedUsers) => {
    if (!taskMembers.value[taskId]) {
      taskMembers.value[taskId] = []
    }

    // Добавляем только новых участников
    selectedUsers.forEach(user => {
      if (!taskMembers.value[taskId].some(m => m.id === user.id)) {
        taskMembers.value[taskId].push({
          id: user.id,
          name: user.name,
          avatar: user.avatar || '',
          role: user.role || 'Участник',
          color: getRandomColor()
        })
      }
    })
  }

  const getRandomColor = () => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return {
    taskMembers,
    getTaskMembers,
    addMembersToTask
  }
}
