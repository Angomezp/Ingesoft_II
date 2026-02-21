// ====================================
// Principio de Sustitucion de Liskov (LSP)
// ====================================

// =====================================
//      Ejemplo de No uso de LSP
// =====================================

class BankAccount {
    protected double balance;

    public BankAccount(double balance) {
        this.balance = balance;
    }

    public void deposit(double amount) {
        balance += amount;
    }

    public void withdraw(double amount) {
        balance -= amount;
    }

    public double getBalance() {
        return balance;
    }
}

class SavingsAccount extends BankAccount {
    public SavingsAccount(double balance) {
        super(balance);
    }

    @Override
    public void withdraw(double amount) {
        throw new UnsupportedOperationException("No se pueden retirar fondos de una cuenta de ahorros");
    }
}
// Si alguien espera usar un BankAccount y recibe un SavingsAccount, el metodo withdraw no funcionara, violando LSP


// =====================================
//      Ejemplo de uso de LSP
// =====================================

interface Withdrawable {
    void withdraw(double amount);
}

class BankAccountLSP implements Withdrawable {
    protected double balance;

    public BankAccountLSP(double balance) {
        this.balance = balance;
    }

    public void deposit(double amount) {
        balance += amount;
    }

    public double getBalance() {
        return balance;
    }

    @Override
    public void withdraw(double amount) {
        balance -= amount;
    }
}

class SavingsAccountLSP extends BankAccountLSP {
    private double balance;

    public SavingsAccountLSP(double balance) {
        super(balance);
    }

    // No implementa Withdrawable, no promete algo que no cumple
}

// Ahora, si alguien espera un Withdrawable, no recibira un SavingsAccountLSP que no puede retirar fondos, cumpliendo LSP