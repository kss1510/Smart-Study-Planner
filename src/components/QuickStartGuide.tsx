import { motion } from 'motion/react'
import { CheckCircle, XCircle, Info, User, LogIn } from 'lucide-react'
import { Card } from './ui/card'

export function QuickStartGuide() {
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-3">
          <div>
            <h3 className="text-gray-900 dark:text-white text-sm mb-2">
              <strong>Having trouble logging in?</strong>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              The login error happens when your email/password doesn't match our records. Here's what to do:
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <strong className="text-gray-900 dark:text-white">First time here?</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  Click "Sign up" below to create a new account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <strong className="text-gray-900 dark:text-white">Already signed up?</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  Click "Check if My Email Has an Account" to verify your account exists, then double-check your password
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <XCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <strong className="text-gray-900 dark:text-white">Password tips:</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  • Passwords are case-sensitive (check Caps Lock)
                  <br />
                  • No extra spaces at start or end
                  <br />
                  • Use "Show password" button to verify what you typed
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 <strong>Pro tip:</strong> Open your browser console (F12) to see detailed troubleshooting information
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
