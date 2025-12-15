import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/supabaseClient' 
import QRCode from 'qrcode'
import Background from './Background'
import AuthNavbar from './AuthNavbar'
import notify from '@/lib/notify'

interface EnableMFAProps {
  onEnabled?: () => void; 
}

export default function EnableMFA({ onEnabled }: EnableMFAProps) {
  const navigate = useNavigate()
  const [factorId, setFactorId] = useState<string>('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('') 
  const [secret, setSecret] = useState<string>('')       
  const [verifyCode, setVerifyCode] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  useEffect(() => {
    async function startEnrollment() {
      setIsLoading(true)
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      })

      if (error) {
        setError(error.message)
        notify.error(error.message)
        setIsLoading(false)
        return
      }

      setFactorId(data.id)
      setSecret(data.totp.secret)

      QRCode.toDataURL(data.totp.uri, (err: Error | null | undefined, url: string) => {
        if (err) {
          setError('Failed to generate QR Code')
          notify.error('Failed to generate QR Code')
        } else {
          setQrCodeUrl(url)
        }
        setIsLoading(false)
      })
    }

    startEnrollment()
  }, [])

  const handleVerify = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    
    if (!verifyCode || verifyCode.length !== 6) {
      notify.error("Please enter a valid 6-digit code")
      return
    }

    setError(null)
    
    const challenge = await supabase.auth.mfa.challenge({ factorId })
    
    if (challenge.error) {
      setError(challenge.error.message)
      notify.error(challenge.error.message)
      return
    }

    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code: verifyCode
    })

    if (verify.error) {
      setError(verify.error.message)
      notify.error(verify.error.message)
    } else {
      notify.success("Two-Factor Authentication enabled successfully!")
      if (onEnabled) onEnabled()
      setTimeout(() => {
        navigate('/college')
      }, 1500)
    }
  }

  return (
    <>
      <Background />
      <AuthNavbar />
      
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%]
               w-10/12 max-w-5xl lg:w-[650px] lg:min-h-[760px]
               max-h-[90vh] overflow-y-auto
               bg-white shadow-[0_4px_50px_0_rgba(0,0,0,0.2)] 
               rounded-[35px] flex flex-col items-center justify-center
               px-6 md:px-10 lg:px-12 py-8 z-30"
      >
        <form className="w-full flex flex-col h-full justify-center" onSubmit={handleVerify}>
          <div className="w-full flex flex-col h-full justify-center">
            {/* Header */}
            <h1
              className="text-center mb-3 lg:mb-4 text-[28px] lg:text-[32px] leading-tight 
                         bg-gradient-to-b from-[#1D5D95] to-[#004689] bg-clip-text text-transparent font-bold"
            >
              Enable Two-Factor Authentication
            </h1>

            {/* Subheader */}
            <p className="text-center mb-4 text-[#012243] text-[16px] lg:text-[18px]">
              Add an extra layer of security to your account
            </p>

            {/* Warning Banner */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 font-semibold">
                    Important Notice
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Once enabled, 2FA cannot be removed or disabled. You will need your authenticator app for all future logins.
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D5D95] mb-4"></div>
                <p className="text-gray-600 text-[16px]">Generating security keys...</p>
              </div>
            ) : qrCodeUrl ? (
              <>
                {/* Instructions */}
                <div className="mb-6 text-center">
                  <p className="text-[#1E1E1E] text-[16px] mb-4">
                    Scan this QR code with your authenticator app
                  </p>
                  <p className="text-gray-500 text-[14px] mb-4">
                    (Google Authenticator, Authy, Microsoft Authenticator, etc.)
                  </p>
                  
                  {/* QR Code */}
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                      <img 
                        src={qrCodeUrl} 
                        alt="2FA QR Code" 
                        className="w-48 h-48 lg:w-56 lg:h-56"
                      />
                    </div>
                  </div>
                  
                  {/* Manual Entry */}
                  <details className="text-sm text-gray-600 cursor-pointer mb-6">
                    <summary className="hover:text-[#1D5D95] transition-colors">
                      Can't scan? Enter code manually
                    </summary>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-mono text-[12px] break-all select-all text-[#1E1E1E]">
                        {secret}
                      </p>
                    </div>
                  </details>
                </div>

                {/* Verification Code Input */}
                <div className="mb-6 lg:mb-8">
                  <label className="block mb-2 text-[#1E1E1E] text-[18px] text-center font-semibold">
                    Enter 6-Digit Code <span className="text-[#DDA104]">*</span>
                  </label>
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerifyCode(value);
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-[#979797] rounded-[15px] 
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D5D95] 
                               text-[24px] text-center font-bold tracking-[0.5em]"
                    autoFocus
                  />
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Enter the code shown in your authenticator app
                  </p>
                </div>

                {/* Enable Button */}
                <button
                  type="submit"
                  disabled={verifyCode.length !== 6}
                  className="w-full py-3 rounded-full text-white font-bold text-lg mb-4
                             bg-gradient-to-b from-[#1D5D95] to-[#004689]
                             hover:scale-[1.02] transition-transform shadow-lg active:scale-95
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Enable Two-Factor Authentication
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => navigate("/college")}
                  className="w-full py-3 rounded-full text-[#1D5D95] font-semibold text-lg
                             border-2 border-[#1D5D95] hover:bg-gray-50 transition-colors"
                >
                  Skip for Now
                </button>
              </>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-4 text-lg font-semibold">
                  Failed to initialize 2FA
                </div>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  type="button"
                  onClick={() => navigate("/college")}
                  className="px-6 py-3 rounded-full text-white font-bold
                             bg-gradient-to-b from-[#1D5D95] to-[#004689]
                             hover:scale-[1.02] transition-transform shadow-lg"
                >
                  Return to College
                </button>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </>
  )
}