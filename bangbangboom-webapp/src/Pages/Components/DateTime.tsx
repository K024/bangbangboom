import React, { useEffect } from "react"
import { FormattedMessage, FormattedDate } from "react-intl"
import { useLocalStore, useObserver } from "mobx-react-lite"

export type DateTimeProps = { date: string | Date }

const oneminute = 60 * 1000
const onehour = 60 * 60 * 1000

export const DateTime = ({ date }: DateTimeProps) => {

  const s = useLocalStore(() => ({
    display: <></>,
  }))

  useEffect(() => {
    const d = typeof date === "string" ? new Date(date) : date
    let toid = 0

    // eslint-disable-next-line
    const update = () => {
      const now = new Date()
      const diff = now.getTime() - d.getTime()
      if (diff < onehour) {
        const minute = Math.ceil(diff / oneminute)
        const next = minute * oneminute - diff
        s.display = <FormattedMessage id="number.minutesago" values={{ count: minute }} />
        toid = setTimeout(update, next) as any
      } else if (diff < 24 * onehour) {
        const hour = Math.ceil(diff / onehour)
        const next = hour * onehour - diff
        s.display = <FormattedMessage id="number.minutesago" values={{ count: hour }} />
        toid = setTimeout(update, next) as any
      } else {
        s.display = <FormattedDate value={d} />
      }
    }

    return () => { clearTimeout(toid) }
  }, [s, date])

  return useObserver(() => s.display)
}


