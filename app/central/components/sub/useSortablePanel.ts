import { useState, useCallback } from 'react'
import {
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'

interface SortableItem {
  id: string
  ordem?: number | null
}

interface UseSortablePanelOptions {
  filmeId: string
  endpoint: string // e.g. 'creditos', 'assets', 'elenco', etc.
}

export function useSortablePanel<T extends SortableItem>(
  items: T[],
  setItems: (items: T[]) => void,
  { filmeId, endpoint }: UseSortablePanelOptions
) {
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex(item => item.id === active.id)
    const newIndex = items.findIndex(item => item.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // Optimistic reorder
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      ordem: idx + 1,
    }))
    setItems(reordered)

    // Persist to API
    setIsSaving(true)
    try {
      await fetch(`/api/admin/filmes/${filmeId}/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: reordered.map(item => ({ id: item.id, ordem: item.ordem })),
        }),
      })
    } catch {
      // If save fails, items are already optimistically reordered — acceptable UX
    } finally {
      setIsSaving(false)
    }
  }, [items, setItems, filmeId, endpoint])

  return { sensors, handleDragEnd, isSaving }
}
