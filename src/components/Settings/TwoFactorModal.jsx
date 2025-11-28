import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { userService } from '@/services/userService';

const TwoFactorModal = ({ isOpen, onClose, isEnabled, onToggle }) => {
  const [step, setStep] = useState(1); // 1: method, 2: qr, 3: verify, 4: backup
  const [method, setMethod] = useState('app');
  const [verificationCode, setVerificationCode] = useState('');

  if (!isOpen) return null;

  const enableMutation = useMutation(userService.enable2FA, {
    onSuccess: () => {
      setStep(3);
    },
    onError: () => {
      toast.error('Failed to enable 2FA');
    }
  });

  const verifyMutation = useMutation(userService.verify2FA, {
    onSuccess: () => {
      setStep(4);
    },
    onError: () => {
      toast.error('Invalid verification code');
    }
  });

  const disableMutation = useMutation(userService.disable2FA, {
    onSuccess: () => {
      toast.success('Two-factor authentication disabled');
      onToggle(false);
      onClose();
    },
    onError: () => {
      toast.error('Failed to disable 2FA');
    }
  });

  const handleEnable = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      enableMutation.mutate();
    } else if (step === 3) {
      verifyMutation.mutate(verificationCode);
    } else {
      toast.success('Two-factor authentication enabled successfully');
      onToggle(true);
      onClose();
      setStep(1);
      setVerificationCode('');
    }
  };

  const handleDisable = () => {
    disableMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Two-Factor Authentication
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {isEnabled ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Two-factor authentication is currently enabled for your account.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleDisable}
                disabled={disableMutation.isLoading}
                className="btn-danger"
              >
                {disableMutation.isLoading ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {step === 1 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">Choose your preferred 2FA method:</p>
                <div className="space-y-3 mb-4">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="method"
                      value="app"
                      checked={method === 'app'}
                      onChange={(e) => setMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">Authenticator App</p>
                      <p className="text-xs text-gray-500">Use Google Authenticator, Authy, or similar</p>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="method"
                      value="sms"
                      checked={method === 'sms'}
                      onChange={(e) => setMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">SMS</p>
                      <p className="text-xs text-gray-500">Receive codes via text message</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with your authenticator app:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center">
                  <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 mx-auto flex items-center justify-center">
                    QR Code
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Manual entry key: ABCD-EFGH-IJKL-MNOP
                </p>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the 6-digit code from your authenticator app:
                </p>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  className="input-field w-full mb-4 text-center text-lg tracking-widest"
                  maxLength="6"
                />
              </div>
            )}

            {step === 4 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Save these backup codes in a safe place. You can use them to access your account if you lose your device.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {['ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345', 'PQR678'].map((code, i) => (
                      <div key={i} className="p-2 bg-white rounded border text-center">{code}</div>
                    ))}
                  </div>
                </div>
                <button className="btn-secondary w-full mb-4">
                  Download Backup Codes
                </button>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleEnable}
                disabled={(step === 3 && verificationCode.length !== 6) || enableMutation.isLoading || verifyMutation.isLoading}
                className="btn-primary disabled:opacity-50"
              >
                {enableMutation.isLoading ? 'Setting up...' : 
                 verifyMutation.isLoading ? 'Verifying...' :
                 step === 1 ? 'Continue' :
                 step === 2 ? 'Continue' :
                 step === 3 ? 'Verify & Enable' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorModal;