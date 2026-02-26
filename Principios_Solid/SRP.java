// ====================================
// Principio de Responsabilidad Única (SRP)
// ====================================

// =====================================
//      Ejemplo de No uso de SRP
// =====================================

class User_Service {

    public void registerUser(String name, String email, String password) {
        // Validar
        if (name == null || email == null || password == null) {
            throw new IllegalArgumentException("Datos invalidos");
        }

        // Encriptar
        String encrypted = encryptPassword(password);

        // Guardar en base de datos
        System.out.println("Guardando usuario en BD: " + name);

        // Enviar email
        System.out.println("Enviando email de bienvenida a " + email);
    }

    private String encryptPassword(String password) {
        return "ENCRYPTED_" + password;
    }
}

// La clase User_Service tiene varias responsabilidades: validar datos, encriptar contraseñas, guardar usuarios y enviar emails, violando SRP

// =====================================
//      Ejemplo de uso de SRP
// =====================================


class User {
    private String name;
    private String email;
    private String encryptedPassword;

    public User(String name, String email, String encryptedPassword) {
        this.name = name;
        this.email = email;
        this.encryptedPassword = encryptedPassword;
    }

    // Getters para acceder a los atributos
    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }
}

class UserValidator {
    public void validate(String name, String email, String password) {
        if (name == null || email == null || password == null) {
            throw new IllegalArgumentException("Datos invalidos");
        }
    }
}

class PasswordEncryptor {
    public String encrypt(String password) {
        return "ENCRYPTED_" + password;
    }
}

class UserRepository {
    public void save(User user) {
        System.out.println("Guardando usuario en BD: " + user.getName());
    }
}

class EmailService {
    public void sendWelcome(String email) {
        System.out.println("Email enviado a " + email);
    }
}

class UserService {

    private UserValidator validator;
    private PasswordEncryptor encryptor;
    private UserRepository repository;
    private EmailService emailService;

    public UserService(
            UserValidator validator,
            PasswordEncryptor encryptor,
            UserRepository repository,
            EmailService emailService
    ) {
        this.validator = validator;
        this.encryptor = encryptor;
        this.repository = repository;
        this.emailService = emailService;
    }

    public void registerUser(String name, String email, String password) {

        validator.validate(name, email, password);

        String encrypted = encryptor.encrypt(password);

        User user = new User(name, email, encrypted);

        repository.save(user);

        emailService.sendWelcome(email);
    }
}

// Cada clase tiene una sola responsabilidad, cumpliendo con SRP