import { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

const notificationReducer = (state, action) => {
  switch(action.type) {
    case "VOTE":
      return action.payload
    case "CREATE":
      return action.payload
    case "POST_FAIL":
      return action.payload
    case "CLEAR":
      return null
    default: 
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={ [notification, notificationDispatch] }>
      {children}
    </NotificationContext.Provider>
  )
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export default NotificationContext