// components/common/Stepper.js
import React from "react";

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    currentStep >= step.number
                      ? "bg-primary-600"
                      : "bg-gray-600"
                  }
                  ${
                    currentStep === step.number
                      ? "ring-2 ring-primary-400"
                      : ""
                  }`}
              >
                <span className="text-white text-sm">{step.number}</span>
              </div>
              <span
                className={`text-xs mt-1 ${
                  currentStep === step.number
                    ? "text-primary-400 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  currentStep > step.number
                    ? "bg-primary-600"
                    : "bg-gray-600"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
