import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // 1. Import useNavigate
import { supabase } from '@/supabaseClient' 
import QRCode from 'qrcode'

interface EnableMFAProps {
  onEnabled?: () => void; 
}

export default function EnableMFA({ onEnabled }: EnableMFAProps) {
  const navigate = useNavigate() // 2. Initialize hook
  const [factorId, setFactorId] = useState<string>('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('') 
  const [secret, setSecret] = useState<string>('')       
  const [verifyCode, setVerifyCode] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function startEnrollment() {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      })

      if (error) {
        setError(error.message)
        return
      }

      setFactorId(data.id)
      setSecret(data.totp.secret)

      QRCode.toDataURL(data.totp.uri, (err: Error | null | undefined, url: string) => {
        if (err) {
          setError('Failed to generate QR Code')
        } else {
          setQrCodeUrl(url)
        }
      })
    }

    startEnrollment()
  }, [])

  const handleVerify = async () => {
    setError(null)
    
    const challenge = await supabase.auth.mfa.challenge({ factorId })
    
    if (challenge.error) {
      setError(challenge.error.message)
      return
    }

    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code: verifyCode
    })

    if (verify.error) {
      setError(verify.error.message)
    } else {
      alert("Success! Two-Factor Authentication enabled.")
      if (onEnabled) onEnabled()
      // Optional: You could also automatically navigate here on success
      // navigate('/college') 
    }
  }

  return (
    <div className="p-4 border rounded-lg max-w-md bg-white shadow-sm">
      <h3 className="font-bold text-lg mb-4">Set up Two-Factor Authentication</h3>
      
      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

      {!qrCodeUrl ? (
        <p className="text-gray-500">Generating security keys...</p>
      ) : (
        <>
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Scan this QR code with your authenticator app (Google Auth, Authy, etc.)
            </p>
            <img src={qrCodeUrl} alt="2FA QR Code" className="mx-auto mb-2 border p-2" />
            
            <details className="text-xs text-gray-500 cursor-pointer">
              <summary>Can't scan? Copy code manually</summary>
              <p className="font-mono mt-1 bg-gray-100 p-2 rounded break-all select-all">
                {secret}
              </p>
            </details>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Enter 6-digit code</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-center tracking-widest text-lg"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
            />
            <button
              onClick={handleVerify}
              disabled={verifyCode.length !== 6}
              className={`w-full text-white p-2 rounded font-semibold transition-colors
                ${verifyCode.length === 6 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              Enable 2FA
            </button>
          </div>
        </>
      )}
        {/* 3. New Button to navigate to /college */}
        <button
            onClick={() => navigate("/college")}
            className="w-full mt-2 text-gray-600 p-2 rounded hover:bg-gray-100 transition-colors text-sm font-medium"
        >
            Cancel / Return to College
        </button>
    </div>
  )
}