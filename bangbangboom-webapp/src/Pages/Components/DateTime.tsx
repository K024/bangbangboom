import React, { useState } from "react"
import { FormattedMessage, FormattedDate } from "react-intl"

export type DateTimeProps = { date: string | Date }

const oneminute = 60 * 1000
const onehour = 60 * 60 * 1000

export const DateTime = ({ date }: DateTimeProps) => {

  const d = typeof date === "string" ? new Date(date) : date

  const [display, setDisplay] = useState(null as React.ReactNode)

  const update = () => {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < onehour) {
      const minute = Math.ceil(diff / oneminute);
      const next = minute * oneminute - diff;
      setDisplay(<FormattedMessage id="number.minutesago" values={{ count: minute }} />)
      setTimeout(update, next);
    } else if (diff < 24 * onehour) {
      const hour = Math.ceil(diff / onehour);
      const next = hour * onehour - diff;
      setDisplay(<FormattedMessage id="number.minutesago" values={{ count: hour }} />)
      setTimeout(update, next);
    } else {
      setDisplay(<FormattedDate value={d} />)
    } aqa
  }

  return display
}


