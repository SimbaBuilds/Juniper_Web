'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountDeleteButton() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const router = useRouter()

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      return
    }

    setIsDeleting(true)
    
    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      })

      if (response.ok) {
        // Redirect to home page after successful deletion
        router.push('/')
      } else {
        // Handle error
        const data = await response.json()
        alert(data.error || 'Failed to delete account')
      }
    } catch (error) {
      alert('An error occurred while deleting your account')
    } finally {
      setIsDeleting(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600 dark:text-red-300 font-semibold">
          This action cannot be undone. Please type DELETE to confirm.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type DELETE to confirm"
          className="w-full px-3 py-2 border border-red-300 rounded-md bg-white dark:bg-gray-800 text-foreground"
        />
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={confirmText !== 'DELETE' || isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
          </button>
          <button
            onClick={() => {
              setShowConfirm(false)
              setConfirmText('')
            }}
            disabled={isDeleting}
            className="bg-gray-300 dark:bg-gray-700 text-foreground px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
    >
      Delete Account
    </button>
  )
}