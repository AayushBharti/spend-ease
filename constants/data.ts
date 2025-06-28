import { CategoryType, ExpenseCategoriesType } from "@/types";
import * as Icons from "phosphor-react-native";

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Groceries",
    value: "groceries",
    icon: Icons.ShoppingCart,
    bgColor: "#4B5563", // Deep Teal Green
  },
  rent: {
    label: "Rent",
    value: "rent",
    icon: Icons.House,
    bgColor: "#075985", // Dark Blue
  },
  utilities: {
    label: "Utilities",
    value: "utilities",
    icon: Icons.Lightbulb,
    bgColor: "#ca8a04", // Dark Golden Brown
  },
  transportation: {
    label: "Transportation",
    value: "transportation",
    icon: Icons.Car,
    bgColor: "#b45309", // Dark Orange-Red
  },
  entertainment: {
    label: "Entertainment",
    value: "entertainment",
    icon: Icons.FilmStrip,
    bgColor: "#0f766e", // Darker Red-Brown
  },
  dining: {
    label: "Dining",
    value: "dining",
    icon: Icons.ForkKnife,
    bgColor: "#be185d", // Dark Red
  },
  health: {
    label: "Health",
    value: "health",
    icon: Icons.Heart,
    bgColor: "#e11d48", // Dark Purple
  },
  insurance: {
    label: "Insurance",
    value: "insurance",
    icon: Icons.ShieldCheck,
    bgColor: "#404040", // Dark Gray
  },
  savings: {
    label: "Savings",
    value: "savings",
    icon: Icons.PiggyBank,
    bgColor: "#065F46", // Deep Teal Green
  },
  clothing: {
    label: "Clothing",
    value: "clothing",
    icon: Icons.TShirt,
    bgColor: "#7c3aed", // Dark Indigo
  },
  personal: {
    label: "Personal",
    value: "personal",
    icon: Icons.User,
    bgColor: "#a21caf", // Deep Pink
  },
  others: {
    label: "Others",
    value: "others",
    icon: Icons.DotsThreeOutline,
    bgColor: "#525252", // Neutral Dark Gray
  },
};

export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: Icons.CurrencyDollarSimple,
  bgColor: "#16a34a", // Dark
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];
