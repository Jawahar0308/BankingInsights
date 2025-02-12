import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
    return (
        <div className="border border-gray-300 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{title}</h3>
            <div>{children}</div>
        </div>
    );
};

export default Card;
