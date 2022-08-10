import { yuqueConfig } from './yuque'
import { dateConfig } from './date'

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  yuque: yuqueConfig,
  date: dateConfig,
})
