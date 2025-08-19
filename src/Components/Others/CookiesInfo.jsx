import { useEffect, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'

const cookieName = 'cookiesAccepted'

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name, value, days = 365, options = {}) {
  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/`
  
  if (days) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    cookieStr += `; expires=${expires.toUTCString()}`
  }

  if (options.secure) {
    cookieStr += '; Secure'
  }
  if (options.sameSite) {
    cookieStr += `; SameSite=${options.sameSite}`
  }

  document.cookie = cookieStr
}

const CookiesInfo = ({
  message = 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
  buttonLabel = 'Got it!',
  delay = 1000, // time before showing popup (ms)
  expiryDays = 365, // default: 1 year
}) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let timeoutId
    const hasAcceptedCookies = getCookie(cookieName) === 'true'

    if (!hasAcceptedCookies) {
      timeoutId = setTimeout(() => setShow(true), delay)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [delay])

  const handleAcceptCookies = () => {
    setShow(false)
    setCookie(cookieName, 'true', expiryDays, { sameSite: 'Lax' })
  }

  return (
    <AnimatePresence>
      {show && (
        <Motion.div
          role="dialog"
          aria-live="polite"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed bottom-1 left-0 right-0 bg-white drop-shadow-lg p-4 z-50"
        >
          <div className="flex justify-between items-center gap-4">
            <p className="text-sm text-gray-700">{message}</p>
            <button
              onClick={handleAcceptCookies}
              className="px-3 py-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              {buttonLabel}
            </button>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookiesInfo
