import { motion } from 'motion/react'
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react'

interface LoginHelperPanelProps {
  email: string
  password: string
}

export function LoginHelperPanel({ email, password }: LoginHelperPanelProps) {
  const checks = [
    {
      label: 'Email format valid',
      valid: email.includes('@') && email.includes('.'),
      warning: !email ? '' : !email.includes('@') ? 'Missing @ symbol' : !email.includes('.') ? 'Missing domain' : ''
    },
    {
      label: 'Email has no spaces',
      valid: !email.includes(' '),
      warning: email.includes(' ') ? 'Remove spaces from email' : ''
    },
    {
      label: 'Password entered',
      valid: password.length > 0,
      warning: password.length === 0 ? 'Enter your password' : ''
    },
    {
      label: 'Password length OK',
      valid: password.length >= 6,
      warning: password.length > 0 && password.length < 6 ? 'Password seems short (min 6 chars usually)' : ''
    }
  ]

  const allValid = checks.every(c => c.valid)
  const hasIssues = checks.some(c => !c.valid && c.warning)

  if (!email && !password) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
    >
      <div className="flex items-start gap-2 mb-2">
        {allValid ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Ready to login! Click "Log In" below.
            </p>
          </>
        ) : hasIssues ? (
          <>
            <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-orange-700 dark:text-orange-400">
              Please fix the issues below:
            </p>
          </>
        ) : null}
      </div>

      {hasIssues && (
        <div className="space-y-1 ml-6">
          {checks.map((check, i) => (
            !check.valid && check.warning && (
              <div key={i} className="flex items-center gap-2 text-xs">
                <XCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">{check.warning}</span>
              </div>
            )
          ))}
        </div>
      )}
    </motion.div>
  )
}
