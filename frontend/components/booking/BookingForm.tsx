"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, CreditCard } from "lucide-react";

interface BookingFormProps {
    provider: any;
    selectedDate: string;
    selectedTime: string;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    insuranceProvider: string;
    memberId: string;
    reasonForVisit: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    insuranceProvider?: string;
    memberId?: string;
}

export default function BookingForm({ provider, selectedDate, selectedTime, onSubmit, isLoading = false }: BookingFormProps) {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        insuranceProvider: '',
        memberId: '',
        reasonForVisit: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Required field validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required";
        } else {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 0 || age > 120) {
                newErrors.dateOfBirth = "Please enter a valid date of birth";
            }
        }

        if (!formData.insuranceProvider.trim()) {
            newErrors.insuranceProvider = "Insurance provider is required";
        }

        if (!formData.memberId.trim()) {
            newErrors.memberId = "Member ID is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Appointment Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Appointment Details</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{provider.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">
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
                        <span className="text-gray-700">{selectedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-green-600">
                            ${provider.price} (Save {provider.originalPrice ? Math.round(((provider.originalPrice - provider.price) / provider.originalPrice) * 100) : 0}%)
                        </span>
                    </div>
                </div>
            </div>

            {/* Patient Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="John"
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Doe"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="john.doe@example.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                    </label>
                    <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                    )}
                </div>
            </div>

            {/* Insurance Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Insurance Information</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Provider *
                    </label>
                    <select
                        value={formData.insuranceProvider}
                        onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.insuranceProvider ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Select your insurance provider</option>
                        {(provider.acceptedInsurance || []).map((insurance: string) => (
                            <option key={insurance} value={insurance}>{insurance}</option>
                        ))}
                    </select>
                    {errors.insuranceProvider && (
                        <p className="mt-1 text-sm text-red-600">{errors.insuranceProvider}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member ID *
                    </label>
                    <input
                        type="text"
                        value={formData.memberId}
                        onChange={(e) => handleInputChange('memberId', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.memberId ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter your member ID"
                    />
                    {errors.memberId && (
                        <p className="mt-1 text-sm text-red-600">{errors.memberId}</p>
                    )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> We'll verify your insurance coverage before your appointment.
                        You'll receive a confirmation email with coverage details.
                    </p>
                </div>
            </div>

            {/* Reason for Visit */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit (Optional)
                </label>
                <textarea
                    value={formData.reasonForVisit}
                    onChange={(e) => handleInputChange('reasonForVisit', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Brief description of your visit purpose..."
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Processing...' : 'Book Appointment'}
            </button>
        </form>
    );
}
