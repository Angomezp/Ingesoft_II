// ====================================
// Principio de Segregación de Interfaces (ISP)
// ====================================

// =====================================
//      Ejemplo de No uso de ISP
// =====================================

interface NotificationService {
    void sendEmail(String to, String message);
    void sendSMS(String to, String message);
    void sendPush(String deviceId, String message);
}

class EmailNotificationService implements NotificationService {
    @Override
    public void sendEmail(String to, String message) {
        System.out.println("Enviando email a " + to);
    }

    @Override
    public void sendSMS(String to, String message) {
        throw new UnsupportedOperationException("No se soporta SMS");
    }

    @Override
    public void sendPush(String deviceId, String message) {
        throw new UnsupportedOperationException("No se soporta Push");
    }
}
// No necesitamos implementar los metodos de SMS y Push en una clase que solo se encargue de enviar emails, violando ISP

// =====================================
//      Ejemplo de  uso de ISP
// =====================================

interface EmailService {
    void sendEmail(String to, String message);
}

interface SMSService {
    void sendSMS(String to, String message);
}

interface PushService {
    void sendPush(String deviceId, String message);
}

class EmailNotificationServiceISP implements EmailService {
    @Override
    public void sendEmail(String to, String message) {
        System.out.println("Enviando email a " + to);
    }
}


class SMSNotificationService implements SMSService {
    @Override
    public void sendSMS(String to, String message) {
        System.out.println("Enviando SMS a " + to);
    }
}

class PushNotificationService implements PushService {
    @Override
    public void sendPush(String deviceId, String message) {
        System.out.println("Enviando Push a " + deviceId);
    }
}

// cada clase implementa solo la interfaz que necesita, cumpliendo con ISP