import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import transactionsData from "../data/json/transactions.json";

interface RelatedTransaction {
    id: number;
    type: string;
    amount: number;
    description: string;
    status: string;
    date: string;
}

interface Transaction {
    id: number;
    userId: number;
    type: "credit" | "debit" | string;
    amount: number;
    date: string;
    description?: string;
    category?: string;
    payment_method?: string;
    action?: string[];
    image?: string;
    badges?: string[];
    childTable?: {
        relatedTransactions: RelatedTransaction[]; // Adjusted to the structure of related transactions
    };
}

interface CategoryData {
    name: string;
    value: number;
}

interface MonthlyData {
    month: string;
    income: number;
    expenses: number;
}


const Dashboard: React.FC = () => {
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

    useEffect(() => {
        const transactions = transactionsData as unknown as Transaction[];

        // Filter transactions by type
        const income = transactions
            .filter((t) => t.type === "credit")
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter((t) => t.type === "debit")
            .reduce((sum, t) => sum + t.amount, 0);

        setTotalIncome(income);
        setTotalExpenses(expenses);

        // Category-wise expense calculation
        const categoryMap: Record<string, number> = {};
        transactions.forEach((t) => {
            if (t.type === "debit" && t.category) {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            }
        });

        setCategoryData(Object.entries(categoryMap).map(([name, value]) => ({ name, value })));

        // Monthly transaction calculation
        const monthMap: Record<string, MonthlyData> = {};
        transactions.forEach((t) => {
            const month = new Date(t.date).toLocaleString("default", { month: "short" });
            if (!monthMap[month]) monthMap[month] = { month, income: 0, expenses: 0 };
            if (t.type === "credit") monthMap[month].income += t.amount;
            if (t.type === "debit") monthMap[month].expenses += t.amount;
        });

        setMonthlyData(Object.values(monthMap));
    }, []);


    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

    return (
        <div className="p-6 w-full h-screen flex flex-col">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <h2 className="text-lg font-semibold">Total Income</h2>
                    <p className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <h2 className="text-lg font-semibold">Total Expenses</h2>
                    <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <h2 className="text-lg font-semibold">Net Balance</h2>
                    <p className="text-2xl font-bold text-blue-600">₹{(totalIncome - totalExpenses).toFixed(2)}</p>
                </div>
            </div>

            {/* Graphs Section */}
            <div className="flex flex-col lg:flex-row gap-6 w-full flex-grow">
                {/* Category-Wise Expense Distribution */}
                <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/2">
                    <h2 className="text-lg font-semibold text-center">Category-Wise Expense Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Transaction Trends */}
                <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/2">
                    <h2 className="text-lg font-semibold text-center">Monthly Transaction Trends</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="income" stroke="#00C49F" name="Income" />
                            <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Expenses" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
