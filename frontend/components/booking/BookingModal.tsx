'use client';

import { useState, useEffect, useRef } from 'react';
import { Provider } from '@/lib/mockData';
import { X, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

interface BookingModalProps {
    provider: Provider;
    selectedDate: string;
    selectedTime: string;
    onClose: () => void;
}

type BookingStep = 'patient-info' | 'insurance' | 'confirmation';

export default function BookingModal({
    provider,
    selectedDate,
    selectedTime,
    onClose,
}: BookingModalProps) {
    const [step, setStep] = useState<BookingStep>('patient-info');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        insuranceProvider: '',
        memberId: '',
        reasonForVisit: '',
    });

    // Focus management
    useEffect(() => {
        const modal = modalRef.current;
        if (modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            const handleTabKey = (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
                if (e.key === 'Escape') {
                    onClose();
                }
            };

            document.addEventListener('keydown', handleTabKey);
            firstElement?.focus();

            return () => {
                document.removeEventListener('keydown', handleTabKey);
            };
        }
    }, [onClose]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleContinue = () => {
        if (step === 'patient-info') {
            setStep('insurance');
        } else if (step === 'insurance') {
            setStep('confirmation');
        }
    };

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            // In real app, this would call your API
            alert('Booking confirmed! Confirmation email sent.');
            onClose();
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPatientInfoValid = formData.firstName && formData.lastName &&
        formData.email && formData.phone && formData.dateOfBirth;

    const isInsuranceValid = formData.insuranceProvider && formData.memberId;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
            <div ref={modalRef} className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto sm:max-h-[95vh]">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex items-center justify-between">
                    <h2 id="booking-modal-title" className="text-xl sm:text-2xl font-bold">Complete Your Booking</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Close dialog"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="p-4 sm:p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                        {['Patient Info', 'Insurance', 'Confirmation'].map((label, index) => {
                            const stepKeys: BookingStep[] = ['patient-info', 'insurance', 'confirmation'];
                            const currentStepIndex = stepKeys.indexOf(step);
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div key={label} className="flex items-center flex-1">
                                    <div className={`flex items-center gap-2 ${index > 0 ? 'flex-1' : ''}`}>
                                        {index > 0 && (
                                            <div className={`flex-1 h-1 ${isCompleted ? 'bg-[#00BFA6]' : 'bg-gray-200'}`} />
                                        )}
                                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${isActive ? 'bg-[#00BFA6] text-white' :
                                            isCompleted ? 'bg-[#00BFA6] text-white' :
                                                'bg-gray-200 text-gray-500'
                                            }`}>
                                            {isCompleted ? '✓' : index + 1}
                                        </div>
                                    </div>
                                    <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${isActive ? 'text-[#00BFA6]' : 'text-gray-500'
                                        }`}>
                                        <span className="hidden sm:inline">{label}</span>
                                        <span className="sm:hidden">{index + 1}</span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Appointment Summary */}
                <div className="p-4 sm:p-6 bg-blue-50">
                    <h3 className="font-semibold mb-3 text-sm sm:text-base">Appointment Details</h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>{provider.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>
                                {new Date(selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{selectedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-green-600">
                                ${provider.price} (Save {provider.originalPrice ? Math.round(((provider.originalPrice - provider.price) / provider.originalPrice) * 100) : 0}%)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-4 sm:p-6">
                    {step === 'patient-info' && (
                        <PatientInfoForm formData={formData} onChange={handleInputChange} />
                    )}

                    {step === 'insurance' && (
                        <InsuranceForm
                            formData={formData}
                            onChange={handleInputChange}
                            acceptedInsurance={provider.acceptedInsurance || []}
                        />
                    )}

                    {step === 'confirmation' && (
                        <ConfirmationStep
                            provider={provider}
                            formData={formData}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                        />
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t p-4 sm:p-6 flex gap-3 sm:gap-4">
                    {step !== 'patient-info' && (
                        <button
                            onClick={() => {
                                if (step === 'insurance') setStep('patient-info');
                                if (step === 'confirmation') setStep('insurance');
                            }}
                            className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors min-h-[44px] text-sm sm:text-base"
                        >
                            Back
                        </button>
                    )}

                    {step !== 'confirmation' ? (
                        <button
                            onClick={handleContinue}
                            disabled={
                                (step === 'patient-info' && !isPatientInfoValid) ||
                                (step === 'insurance' && !isInsuranceValid)
                            }
                            className="flex-1 py-3 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#00A896] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed min-h-[44px] text-sm sm:text-base"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleConfirmBooking}
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#00A896] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner size="sm" className="text-white" />
                                    Processing...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Patient Info Form
function PatientInfoForm({
    formData,
    onChange
}: {
    formData: any;
    onChange: (field: string, value: string) => void;
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Patient Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                    </label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => onChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent"
                        placeholder="John"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                    </label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => onChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent"
                    placeholder="john.doe@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                </label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent"
                    placeholder="(555) 123-4567"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                </label>
                <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => onChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit (Optional)
                </label>
                <textarea
                    value={formData.reasonForVisit}
                    onChange={(e) => onChange('reasonForVisit', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent"
                    placeholder="Brief description of your visit purpose..."
                />
            </div>
        </div>
    );
}

// Insurance Form
function InsuranceForm({
    formData,
    onChange,
    acceptedInsurance
}: {
    formData: any;
    onChange: (field: string, value: string) => void;
    acceptedInsurance: string[];
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Provider *
                </label>
                <select
                    value={formData.insuranceProvider}
                    onChange={(e) => onChange('insuranceProvider', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent"
                >
                    <option value="">Select your insurance provider</option>
                    {acceptedInsurance.map(insurance => (
                        <option key={insurance} value={insurance}>{insurance}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member ID *
                </label>
                <input
                    type="text"
                    value={formData.memberId}
                    onChange={(e) => onChange('memberId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent"
                    placeholder="Enter your member ID"
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> We'll verify your insurance coverage before your appointment.
                    You'll receive a confirmation email with coverage details.
                </p>
            </div>
        </div>
    );
}

// Confirmation Step
function ConfirmationStep({
    provider,
    formData,
    selectedDate,
    selectedTime
}: {
    provider: Provider;
    formData: any;
    selectedDate: string;
    selectedTime: string;
}) {
    return (
        <div className="space-y-6">
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Review Your Booking</h3>
                <p className="text-gray-600">Please confirm all details are correct</p>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Appointment Details</h4>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Provider:</dt>
                            <dd className="font-medium">{provider.name}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Date:</dt>
                            <dd className="font-medium">
                                {new Date(selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Time:</dt>
                            <dd className="font-medium">{selectedTime}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Location:</dt>
                            <dd className="font-medium">
                                {typeof provider.address === 'string'
                                    ? provider.address
                                    : `${provider.address.city}, ${provider.address.state}`
                                }
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Patient Information</h4>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Name:</dt>
                            <dd className="font-medium">{formData.firstName} {formData.lastName}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Email:</dt>
                            <dd className="font-medium">{formData.email}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Phone:</dt>
                            <dd className="font-medium">{formData.phone}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Insurance:</dt>
                            <dd className="font-medium">{formData.insuranceProvider}</dd>
                        </div>
                    </dl>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Estimated Cost:</span>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                                ${provider.price}
                            </div>
                            <div className="text-sm text-gray-600 line-through">
                                ${provider.originalPrice}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> You can cancel or reschedule up to 24 hours before
                    your appointment without any charges.
                </p>
            </div>
        </div>
    );
}
