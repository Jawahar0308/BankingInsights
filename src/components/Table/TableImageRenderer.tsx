import React from 'react';

interface TableImageRendererProps {
    src: string;
    alt: string;
}

const TableImageRenderer: React.FC<TableImageRendererProps> = ({ src, alt }) => {
    return <img src={src} alt={alt} className="w-10 h-10" />;
};

export default TableImageRenderer;
