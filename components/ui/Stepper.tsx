import React from 'react';

// This is a placeholder component and is not currently used in the application.
// It can be built out later to show multi-step processes.

interface StepperProps {
    steps: string[];
    currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center w-full p-4">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index <= currentStep ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                            {index + 1}
                        </div>
                        <p className={`ml-2 ${index <= currentStep ? 'text-primary' : 'text-on-surface-variant'}`}>{step}</p>
                    </div>
                    {index < steps.length - 1 && <div className="flex-auto border-t-2 transition duration-500 ease-in-out mx-4 border-outline"></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Stepper;
