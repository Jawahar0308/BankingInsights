import React from "react";
import bankTransferLogo from "../../assets/bank_transfer_logo.png";
import creditCardLogo from "../../assets/credit_card_logo.jpeg";
import upiLogo from "../../assets/upi_logo.png";
import paypalLogo from "../../assets/paypal_logo.png";
import cashLogo from "../../assets/cash_logo.png";
import defaultLogo from "../../assets/default_logo.png";

interface TableImageRendererProps {
    method: string;
}

const imageMap: Record<string, string> = {
    "Bank Transfer": bankTransferLogo,
    "Credit Card": creditCardLogo,
    "UPI": upiLogo,
    "PayPal": paypalLogo,
    "Cash": cashLogo,
    "Default": defaultLogo
};

const TableImageRenderer: React.FC<TableImageRendererProps> = ({ method }) => {
    // Convert method to title case to match imageMap keys
    const formattedMethod = method
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const imageUrl = imageMap[formattedMethod] || imageMap['Default'];

    return <img src={imageUrl} alt={method} className="w-8 h-8 object-contain" />;
};

export default TableImageRenderer;
