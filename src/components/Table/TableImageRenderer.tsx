import React from "react";

interface TableImageRendererProps {
    method: string;
}

const imageMap: Record<string, string> = {
    "Bank Transfer": "/assets/bank_transfer_logo.png",
    "Credit Card": "/assets/credit_card_logo.jpeg",
    "UPI": "/images/upi_logo.png",
    "PayPal": "/assets/paypal_logo.png",
    "Cash": "/images/upi_logo.png",
};

const TableImageRenderer: React.FC<TableImageRendererProps> = ({ method }) => {
    const imageUrl = imageMap[method] || "/assets/default_logo.png";

    return <img src={imageUrl} alt={method} className="w-8 h-8 object-contain" />;
};

export default TableImageRenderer;
