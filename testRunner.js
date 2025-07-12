import { addExpense, getExpenses, resetExpenses } from './expenseService.js';

function simulateUITest(description, testFn) {
    try {
        testFn();
        console.log(`✅ ${description}`);
    } catch (e) {
        console.error(`❌ ${description} — ${e.message}`);
    }
}

function runUITests() {
    console.log('🚀 Iniciando testes simulados da UI');

    // ========== Funcionalidade 1: Adicionar Novo Gasto ==========

    simulateUITest('Passo 1: Formulário aparece ao clicar em "+"', () => {
        // Simula clicar no botão flutuante
        window.openAddExpenseForm();
        const form = document.getElementById('addExpenseForm');
        if (form.style.display !== 'flex') throw new Error('Formulário não exibido');
    });

    simulateUITest('Passo 2: Preenchimento do valor "50"', () => {
        const input = document.getElementById('expenseAmount');
        input.value = 50;
        if (parseFloat(input.value) !== 50) throw new Error('Valor não atribuído corretamente');
    });

    simulateUITest('Passo 3: Preenchimento da descrição "Jantar"', () => {
        const input = document.getElementById('expenseDescription');
        input.value = 'Jantar';
        if (input.value !== 'Jantar') throw new Error('Descrição não atribuída corretamente');
    });

    simulateUITest('Passo 4: Seleção da categoria Alimentação', () => {
        document.querySelector('[data-category="alimentacao"]').click();
        const isSelected = document.querySelector('[data-category="alimentacao"]').classList.contains('selected');
        if (!isSelected) throw new Error('Categoria não selecionada');
    });

    simulateUITest('Passo 5: Seleção da data', () => {
        const input = document.getElementById('expenseDate');
        const today = new Date().toISOString().split('T')[0];
        input.value = today;
        if (input.value !== today) throw new Error('Data não atribuída corretamente');
    });

    simulateUITest('Passo 6: Preenchimento de observações', () => {
        const textarea = document.getElementById('expenseNotes');
        textarea.value = 'Teste de observações';
        if (textarea.value !== 'Teste de observações') throw new Error('Observações não atribuídas');
    });

    simulateUITest('Passo 7: Enviar o formulário', () => {
        const form = document.getElementById('expenseForm');
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        const success = document.getElementById('successMessage').style.display === 'block';
        if (!success) throw new Error('Mensagem de sucesso não exibida');
    });

    simulateUITest('Passo 8: Novo gasto aparece nos "Últimos gastos"', () => {
        const lastExpense = document.querySelectorAll('.expense-item')[0];
        if (!lastExpense || !lastExpense.textContent.includes('Jantar')) {
            throw new Error('Gasto recente não aparece');
        }
    });

    simulateUITest('Passo 9: Total gasto do mês foi atualizado', () => {
        const totalAmountText = document.querySelector('.total-amount').textContent;
        if (!totalAmountText.includes('R$ 50')) {
            throw new Error('Total não atualizado corretamente');
        }
    });

    // ========== Funcionalidade 2: Visualizar Extrato de Gastos ==========

    simulateUITest('Passo 1: Modal "Histórico" abre ao clicar no ícone 🕓', () => {
        const historyBtn = Array.from(document.querySelectorAll('.nav-item'))
            .find(el => el.textContent.includes('Histórico'));
        historyBtn.click();
        const modalTitle = document.getElementById('modal-title').textContent;
        if (modalTitle !== 'Histórico') throw new Error('Modal de histórico não foi exibido');
    });

    simulateUITest('Passo 2: Todos os gastos cadastrados aparecem no extrato', () => {
        const allExpenses = getExpenses();
        if (allExpenses.length < 1) throw new Error('Nenhum gasto retornado pelo extrato');
    });

    simulateUITest('Passo 3: Gastos estão em ordem decrescente de data', () => {
        const sorted = getExpenses();
        const dates = sorted.map(e => e.date.getTime());
        const isDescending = dates.every((d, i) => i === 0 || d <= dates[i - 1]);
        if (!isDescending) throw new Error('Ordem do extrato incorreta');
    });

    simulateUITest('Passo 4: Modal de detalhes aparece ao clicar em gasto', () => {
        const item = document.querySelector('.expense-item');
        item.click();
        const modal = document.getElementById('modal');
        if (modal.style.display !== 'flex') throw new Error('Modal de detalhe não abriu');
    });

    simulateUITest('Passo 5: Fechar modal de detalhes', () => {
        document.getElementById('modal').click(); // simula clique fora
        const modal = document.getElementById('modal');
        if (modal.style.display === 'flex') throw new Error('Modal não foi fechado');
    });

    simulateUITest('Passo 6: Gasto novo aparece no extrato após adicionar', () => {
        const countBefore = getExpenses().length;

        addExpense({
            description: 'TesteExtra',
            amount: 77,
            category: 'outros',
            date: new Date(),
            time: '12:00',
            notes: ''
        });

        const countAfter = getExpenses().length;
        if (countAfter !== countBefore + 1) throw new Error('Gasto extra não foi adicionado ao extrato');
    });

    console.log('🏁 Testes simulados finalizados');
}

runUITests();
