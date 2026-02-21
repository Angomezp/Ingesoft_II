// ====================================
// Principio Open/Closed (OCP)
// ====================================

// =====================================
//      Ejemplo de No uso de OCP
// =====================================


class DiscountService {

    public double applyDiscount(double price, String discountType) {
        switch (discountType) {
            case "NORMAL":
                return price;
            case "STUDENT":
                return price * 0.90;
            case "BLACK_FRIDAY":
                return price * 0.70;
            default:
                throw new IllegalArgumentException("Tipo de descuento no soportado");
        }
    }
}

// Si yo quiero agregar un nuevo tipo de descuento, tengo que modificar esta clase, lo cual viola el OCP.

// =====================================
//      Ejemplo de uso de OCP
// =====================================

interface DiscountStrategy {
    double apply(double price);
}

class NormalDiscount implements DiscountStrategy {
    public double apply(double price) {
        return price;
    }
}

class StudentDiscount implements DiscountStrategy {
    public double apply(double price) {
        return price * 0.90;
    }
}

class BlackFridayDiscount implements DiscountStrategy {
    public double apply(double price) {
        return price * 0.70;
    }
}

class DiscountServiceV2 {
    public double applyDiscount(double price, DiscountStrategy strategy) {
        return strategy.apply(price);
    }
}
// Ahora, si quiero agregar un nuevo tipo de descuento, solo tengo que crear una nueva clase que 
// implemente DiscountStrategy, sin modificar el código existente. Esto cumple con el OCP.

class HolidayDiscount implements DiscountStrategy {
    public double apply(double price) {
        return price * 0.80;
    }
}