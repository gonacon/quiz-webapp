import React from 'react';
import { FEATURE_CARDS } from 'constants/messages';

export const FeatureCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {FEATURE_CARDS.map((card, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-2xl mb-1">{card.icon}</div>
                    <h3 className="font-bold text-lg mb-1">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                </div>
            ))}
        </div>
    );
}; 