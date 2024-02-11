import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/fr'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

export const localizeDateFromIso8601 = (
  date: string,
  locale: string,
  includeTime: boolean = true
): string => {
  // Set the locale for dayjs to match the user's locale
  dayjs.locale(locale)
  dayjs.extend(LocalizedFormat)

  // Create a Day.js instance from the provided Date object
  const formattedDate = dayjs(date)

  const format = includeTime ? 'L LT' : 'L'

  // Format the date using the built-in localization feature
  return formattedDate.format(format)
}
