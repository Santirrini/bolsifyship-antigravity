'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
    currentStep: number;
}

const steps = [
    { id: 1, name: 'Shipping' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Review' },
];

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-center space-x-4">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex items-center">
                            {/* Step Circle */}
                            <div
                                className={`
                                    flex items-center justify-center w-8 h-8 rounded-full border-2 
                                    transition-colors duration-300
                                    ${isCompleted || isCurrent
                                        ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black'
                                        : 'border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-600'}
                                `}
                            >
                                {isCompleted ? (
                                    <Check size={16} />
                                ) : (
                                    <span className="text-sm font-medium">{step.id}</span>
                                )}
                            </div>

                            {/* Step Name */}
                            <span
                                className={`
                                    ml-2 text-sm font-medium
                                    ${isCompleted || isCurrent
                                        ? 'text-black dark:text-white'
                                        : 'text-gray-400 dark:text-gray-600'}
                                `}
                            >
                                {step.name}
                            </span>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="w-12 h-0.5 mx-4 bg-gray-200 dark:bg-gray-700">
                                    <motion.div
                                        className="h-full bg-black dark:bg-white"
                                        initial={{ width: '0%' }}
                                        animate={{ width: isCompleted ? '100%' : '0%' }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
