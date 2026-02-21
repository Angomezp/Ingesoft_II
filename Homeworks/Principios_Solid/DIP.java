// ====================================
// Principio de Dependencia Inversa (DIP)
// ====================================

// =====================================
//      Ejemplo de No uso de DIP
// =====================================

class PayPalPayment {
    public void pay(double amount) {
        System.out.println("Pagando con PayPal: " + amount);
    }
}

class Order {
    private PayPalPayment payment;

    public Order() {
        this.payment = new PayPalPayment();
    }

    public void checkout(double amount) {
        payment.pay(amount);
    }
}

// La clase Order depende directamente de la clase PayPalPayment, violando DIP

// =====================================
//      Ejemplo de  uso de DIP
// =====================================

interface PaymentMethod {
    void pay(double amount);
}

class PayPalPaymentDIP implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Pagando con PayPal: " + amount);
    }
}

class OrderDIP {
    private PaymentMethod payment;

    public OrderDIP(PaymentMethod payment) {
        this.payment = payment;
    }

    public void checkout(double amount) {
        payment.pay(amount);
    }
}

// La clase OrderDIP depende de la abstracción PaymentMethod, no de una implementación concreta, cumpliendo con DIP
