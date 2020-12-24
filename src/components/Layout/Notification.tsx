import { Post } from 'types'
import React, { useState, useEffect } from 'react'
import renderHTML from 'react-render-html'

type Props = {
  post: Post
}

const Notification: React.FC<Props> = (props) => {
  const { post } = props
  const { _id, title, content } = post
  const [hidden, setHidden] = useState(true)

  const [closedNotifications, setClosedNotifications] = useState<
    string[]
  >([])

  useEffect(() => {
    let localClosedNotificationsJson = localStorage.getItem(
      'closedNotifications'
    )

    let localClosedNotifications

    if (!localClosedNotificationsJson) {
      localStorage.setItem('closedNotifications', JSON.stringify([]))
      localClosedNotifications = []
    } else {
      localClosedNotifications = JSON.parse(localClosedNotificationsJson)
      setClosedNotifications(localClosedNotifications)
    }

    if (!localClosedNotifications.includes(_id)) {
      setHidden(false)
    }
  }, [])

  const closeNotification = () => {
    const newClosedNotifications = [...closedNotifications, _id]
    setHidden(true)
    setClosedNotifications(newClosedNotifications)
    localStorage.setItem(
      'closedNotifications',
      JSON.stringify(newClosedNotifications)
    )
  }

  return (
    <div
      className={`notification ${
        hidden ? 'notification--hidden' : ''
      }`}
    >
      <div className="notification__content">
        <h4 className="notification__title">{title}</h4>
        <div className="notification__text">
          {renderHTML(content)}
        </div>
      </div>
      <button
        className="notification__close"
        onClick={closeNotification}
      >
        &#10005;
      </button>
    </div>
  )
}

export default Notification
