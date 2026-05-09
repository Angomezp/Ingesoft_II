// El patron Factory es un patron de diseño creacional que proporciona una interfaz para crear 
// objetos en una superclase, pero permite a las subclases alterar el tipo de objetos que se crearán.
// El patrón Factory es útil cuando el proceso de creación de objetos es complejo o cuando se tiene muchas 
// clases que implementan una interfaz común, y se desea centralizar la lógica de creación de objetos en un solo lugar.

// Por ejemplo en una pasarela de pagos con muchos metodos.

interface PaymentMethod {
    void pay(double amount);
}

// Cada clase concreta implementa la interfaz PaymentMethod y proporciona su propia implementación del método pay().
// Además, cada clase concreta puede tener métodos específicos relacionados con su tipo de pago.
// Asi mismo, el cliente no necesita conocer los detalles de cada método de pago, solo necesita interactuar con 
// la interfaz común PaymentMethod a través de la fábrica PaymentFactory.
class CreditCard implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Paying " + amount + " with Credit Card");
    }
    public void viewTransactionHistory() {
        System.out.println("Viewing Credit Card transaction history");
    }
}

class PayPal implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Paying " + amount + " with PayPal");
    }
    public void login(String email, String password) {
        System.out.println("Logging in to PayPal with email: " + email);
    }
    public void logout() {
        System.out.println("Logging out of PayPal");
    }
    public void viewTransactionHistory() {
        System.out.println("Viewing PayPal transaction history");
    }
}

class DebitCard implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Paying " + amount + " with Debit Card");
    }
    public void viewTransactionHistory() {
       System.out.println("Viewing Debit Card transaction history");
    }

    public void addFunds(double amount) {
        System.out.println("Adding " + amount + " to Debit Card");
    }
}

class CryptoCurrency implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Paying " + amount + " with Cryptocurrency");
    }
    public void viewTransactionHistory() {
        System.out.println("Viewing Cryptocurrency transaction history");
    }
    public void viewWalletBalance() {
        System.out.println("Viewing Cryptocurrency wallet balance");
    }
}

/*
 Factory:
 Centraliza la creación de objetos.
 El cliente no necesita saber qué clase concreta instanciar.
*/
class PaymentFactory {

    public static PaymentMethod createPayment(String type) {

        if (type.equalsIgnoreCase("credit")) {
            return new CreditCard();

        } else if (type.equalsIgnoreCase("paypal")) {
            return new PayPal();

        } else if (type.equalsIgnoreCase("debit")) {
            return new DebitCard();

        } else if (type.equalsIgnoreCase("crypto")) {
            return new CryptoCurrency();
        }

        throw new IllegalArgumentException("Unknown payment type");
    }
}

public class Factory {

    public static void main(String[] args) {

        PaymentMethod payment1 = PaymentFactory.createPayment("credit");

        PaymentMethod payment2 = PaymentFactory.createPayment("paypal");

        PaymentMethod payment3 = PaymentFactory.createPayment("debit");

        PaymentMethod payment4 = PaymentFactory.createPayment("crypto");

        payment1.pay(100.0);
        payment2.pay(200.0);
        payment3.pay(150.0);
        payment4.pay(300.0);
    }
}
