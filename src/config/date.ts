export interface IDateConfig {
  currYear: number
  currMonth: number
  currDate: number
  currDay: Date
  currDateStr: string
}

const currDay = new Date()
const currYear = currDay.getFullYear()
const currMonth = currDay.getMonth() + 1
const currDate = currDay.getDate()
const currDateStr = `${currYear}-${currMonth
  .toString()
  .padStart(2, '0')}-${currDate.toString().padStart(2, '0')}`

export const dateConfig: IDateConfig = {
  currYear,
  currMonth,
  currDate,
  currDateStr,
  currDay,
}
