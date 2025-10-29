import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface DebugHelperProps {
  defaultEmail?: string
}

export function DebugHelper({ defaultEmail = '' }: DebugHelperProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Auto-check if default email is provided
  React.useEffect(() => {
    if (defaultEmail && defaultEmail.includes('@')) {
      setTimeout(() => checkUser(), 300)
    }
  }, [])

  const checkUser = async () => {
    if (!email) return
    
    setLoading(true)
    setResult(null)
    
    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-62ce5e0f`
      const res = await fetch(`${serverUrl}/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      setResult(data)
      console.log('User check result:', data)
    } catch (error) {
      console.error('Check user error:', error)
      setResult({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-700">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-6 h-6 text-blue-500" />
        <h2 className="text-gray-900 dark:text-white">Debug Helper - Check if Email Exists</h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Use this tool to check if an email address has an account in the system. This helps troubleshoot login issues.
      </p>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email to check"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkUser()}
            className="flex-1"
          />
          <Button
            onClick={checkUser}
            disabled={loading || !email}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Checking...' : 'Check'}
          </Button>
        </div>

        {result && (
          <div className={`p-4 rounded-xl border-2 ${
            result.error
              ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
              : result.exists
              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
              : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
          }`}>
            {result.error ? (
              <div className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-700 dark:text-red-300">
                    <strong>Error:</strong> {result.error}
                  </p>
                </div>
              </div>
            ) : result.exists ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-300">
                    <strong>Account Found!</strong>
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> {result.email}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>User ID:</strong> {result.userId}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email Confirmed:</strong> {result.emailConfirmed ? 'Yes ✓' : 'No ✗'}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Created:</strong> {new Date(result.createdAt).toLocaleString()}
                  </p>
                  {result.metadata?.name && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Name:</strong> {result.metadata.name}
                    </p>
                  )}
                  <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                      ✓ This email has an account. If you're getting "invalid credentials" errors, 
                      make sure you're using the correct password (passwords are case-sensitive).
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <p className="text-orange-700 dark:text-orange-300">
                    <strong>No Account Found</strong>
                  </p>
                </div>
                <p className="text-orange-600 dark:text-orange-400 text-sm">
                  This email address doesn't have an account yet. You need to sign up first.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2"><strong>Troubleshooting Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check for typos in your email address</li>
            <li>Passwords are case-sensitive - check Caps Lock</li>
            <li>If you recently signed up, the account should exist</li>
            <li>If no account exists, click "Sign up" to create one</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
