import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const AlertLists = [
  {
    status: "error_stat_1",
    message: "Incorrect Username or Password",
    description: "Make sure you entered the correct information.",
    color: "text-red-600",
    border: "border-red-300",
    ok: false,
  },
  {
    status: "ok_stat_1",
    message: "Login Successful",
    description: "You have successfully logged in.",
    color: "text-green-600",
    border: "border-green-300",
    ok: true,
  },
]

type AlertProps = {
  status: string
  autoClose?: number // optional auto-close in ms (e.g., 3000)
}

export default function Alert({ status, autoClose }: AlertProps) {
  const [visible, setVisible] = useState(true)
  const baseMessage = AlertLists.find((a) => a.status === status)

  if (!baseMessage) return null

  // Optional auto-close effect
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => setVisible(false), autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={`rounded-lg border ${baseMessage.border} bg-white p-4 shadow-sm`}
        >
          <div className="flex items-start gap-4">
            {/* Status Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className={`size-6 ${baseMessage.color}`}
            >
              {baseMessage.ok ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008v-.008H12v.008zm9-3.75a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>

            {/* Content */}
            <div className="flex-1">
              <strong className="font-medium text-gray-900">
                {baseMessage.message}
              </strong>
              <p className="mt-0.5 text-sm text-gray-700">
                {baseMessage.description}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setVisible(false)}
              className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              type="button"
              aria-label="Dismiss alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
