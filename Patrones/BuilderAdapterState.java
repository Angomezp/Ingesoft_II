// Podemos ver los patrones Builder, State y Adapter trabajando juntos 
// en este ejemplo de un sistema de procesamiento de órdenes en una tienda en línea.
// El patrón Builder se utiliza para construir objetos de orden complejos,
// el patrón State se utiliza para gestionar los diferentes estados de una orden 
// (creada, pagada, enviada), y el patrón Adapter se utiliza para integrar una API 
// de pago externa (PayPal) con la interfaz de pago del sistema.


// Interfaz común que usará el sistema
interface PaymentGateway {
    void pay(double amount);
}


// API externa de PayPal
class PayPalAPI {
    public void makePayPalPayment(double amount) {
        System.out.println("Paying $" + amount + " using PayPal API");
    }
}


// Adapter de PayPal
class PayPalAdapter implements PaymentGateway {

    private PayPalAPI paypal;

    public PayPalAdapter(PayPalAPI paypal) {
        this.paypal = paypal;
    }

    @Override
    public void pay(double amount) {
        paypal.makePayPalPayment(amount);
    }
}



// ======================================================
// STATE
// ======================================================

interface OrderState {
    void next(Order order);
    void printStatus();
}


class CreatedState implements OrderState {

    @Override
    public void next(Order order) {
        order.setState(new PaidState());
    }

    @Override
    public void printStatus() {
        System.out.println("Order state: CREATED");
    }
}


class PaidState implements OrderState {

    @Override
    public void next(Order order) {
        order.setState(new ShippedState());
    }

    @Override
    public void printStatus() {
        System.out.println("Order state: PAID");
    }
}


class ShippedState implements OrderState {

    @Override
    public void next(Order order) {
        System.out.println("Order already delivered");
    }

    @Override
    public void printStatus() {
        System.out.println("Order state: SHIPPED");
    }
}




class Order {

    // Datos de la orden
    private String product;
    private String address;
    private double amount;

    // State Pattern
    private OrderState state;

    // Constructor privado -> Builder
    private Order(OrderBuilder builder) {
        this.product = builder.product;
        this.address = builder.address;
        this.amount = builder.amount;

        this.state = new CreatedState();
    }

    // Builder interno
    public static class OrderBuilder {

        private String product;
        private String address;
        private double amount;

        public OrderBuilder setProduct(String product) {
            this.product = product;
            return this;
        }

        public OrderBuilder setAddress(String address) {
            this.address = address;
            return this;
        }

        public OrderBuilder setAmount(double amount) {
            this.amount = amount;
            return this;
        }

        public Order build() {
            return new Order(this);
        }
    }

    // Procesar pago usando Adapter
    public void processPayment(PaymentGateway gateway) {
        gateway.pay(amount);
    }

    // State methods
    public void setState(OrderState state) {
        this.state = state;
    }

    public void nextState() {
        state.next(this);
    }

    public void printState() {
        state.printStatus();
    }

    public void showInfo() {
        System.out.println("\n===== ORDER INFO =====");
        System.out.println("Product: " + product);
        System.out.println("Address: " + address);
        System.out.println("Amount: $" + amount);
    }
}



// ======================================================
// MAIN
// ======================================================

public class BuilderAdapterState {

    public static void main(String[] args) {

        // Se crea una orden usando el Builder

        Order order = new Order.OrderBuilder()
                .setProduct("Gaming Laptop")
                .setAddress("Bogotá, Colombia")
                .setAmount(2500)
                .build();


        order.showInfo();


        // Se procesa el pago usando el Adapter de PayPal

        PaymentGateway payment =
                new PayPalAdapter(new PayPalAPI());

        order.processPayment(payment);


        // se muestra el estado de la orden y se avanza a través de los estados usando el State Pattern
        order.printState();

        order.nextState();
        order.printState();

        order.nextState();
        order.printState();
    }
}
