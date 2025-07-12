export let expenses = [];

export function addExpense({ description, amount, category, date, time, notes }) {
    if (!description || !amount || !category || !date) {
        throw new Error('Dados obrigatórios ausentes.');
    }
    const expense = { description, amount, category, date, time, notes };
    expenses.push(expense);
    return expense;
}

export function getExpenses() {
    return expenses.sort((a, b) => b.date - a.date);
}

export function resetExpenses() {
    expenses = [];
}
