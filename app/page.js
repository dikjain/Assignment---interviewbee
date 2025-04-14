'use client'

import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : session ? (
          // Authenticated user view
          <div className="space-y-6">
            <div className="text-center">
              {session.user.image && (
                <Image 
                  src={session.user.image} 
                  alt="Profile" 
                  width={80} 
                  height={80} 
                  className="rounded-full mx-auto border-4 border-gray-100"
                />
              )}
              <h1 className="mt-4 text-2xl font-bold text-gray-800">Welcome, {session.user.name}</h1>
              <p className="text-gray-500">{session.user.email}</p>
            </div>
            
            <div className="space-y-4 pt-4">
              <button 
                className="w-full py-3 px-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Meeting Dashboard
              </button>
              
              <button 
                className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          // Guest view - login options
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">Meeting Scheduler</h1>
              <p className="mt-2 text-gray-600">Sign in to create and manage your meetings</p>
            </div>
            
            <button 
              onClick={() => signIn('google')}
              className="w-full flex items-center justify-center cursor-pointer gap-3 py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 shadow-sm"
            >
              {/* Google icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Sign in with Google
            </button>
            
            <div className="text-center text-sm text-gray-500">
              <p>Secure login powered by Google</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home