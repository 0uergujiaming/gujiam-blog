import dayjs from "dayjs"

export const isDark = useDark()
export const toggleDark = useToggle(isDark)
export const preferredDark = usePreferredDark()

export function formatDate(d: string | Date, format = 'YYYY.MM.DD') {
  const date = dayjs(d)

  return date.format(format)
}
