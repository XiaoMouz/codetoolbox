import { useToast } from '~/components/ui/toast'

export function useHotkey(key: string, callback: () => void) {
  onMounted(() => {
    window.addEventListener('keydown', (event) => {
      if (event.key === key) {
        callback()
      }
    })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', (event) => {
      if (event.key === key) {
        callback()
      }
    })
  })
}

export function useCVHotkey(
  content: Ref<string>,
  result: Ref<string | undefined>
) {
  const { toast } = useToast()
  function copy() {
    navigator.clipboard.writeText(result.value || '')
    toast({
      title: 'Copied',
      description: 'Result has been copied to clipboard',
    })
  }

  function paste() {
    navigator.clipboard.readText().then((text) => {
      content.value = text
      toast({
        title: 'Pasted',
        description: 'Text has been pasted',
      })
    })
  }
  onMounted(() => {
    useHotkey('c', copy)
    useHotkey('v', paste)
  })
  return {
    copy,
    paste,
  }
}
