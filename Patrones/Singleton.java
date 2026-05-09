// EL metodo de Singleton es definir un unico access point para una clase, 
// usado por ejemplo en la instancia de una base de datos 


// Clase User representa un usuario con nombre, email y contraseña
class User {
    private final String name;
    private final String email;
    private final String password;

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = hashPassword(password);
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
    public String getPassword() {
        return password;
    }

    private String hashPassword(String password) {
        return "hashed_" + password;
    }
}

// Clase DatabaseExample simula una base de datos simple para almacenar usuarios
// Proporciona métodos para agregar, mostrar, eliminar y actualizar usuarios
// Esta clase no implementa el patrón Singleton, es solo una representación de la base de datos 
// que podria ser vista como una base de datos externa. (En MySQL, MongoDB, etc)

class DatabaseExample {
    private final User[] Users;

    public DatabaseExample(int size) {
        Users = new User[size];
    }

    public void addUser(User user, int index) {
        if (index >= 0 && index < Users.length) {
            Users[index] = user;
        }
    }
    public void displayUsers() {
        for (User user : Users) {
            if (user != null) {
                System.out.println("Name: " + user.getName() + ", Email: " + user.getEmail() + ", Password: " + user.getPassword());
            }
        }
        System.out.println();
    }

    public void deleteUser(int index) {
        if (index >= 0 && index < Users.length) {
            Users[index] = null;
        }
    }

    public void updateUser(User user, int index) {
        if (index >= 0 && index < Users.length) {
            Users[index] = user;
        }
    }
}

// Clase DatabaseConnection implementa el patrón Singleton para gestionar 
// una única instancia de la base de datos

class DatabaseConnection {
    private static DatabaseConnection instance;
    private final DatabaseExample db;

    private DatabaseConnection() {
        // Aqui en vez de crear una base de datos de ejemplo, se podria conectar a una 
        // base de datos real, como MySQL, MongoDB, etc
        db = new DatabaseExample(10);
    }

    public void addUser(User user, int index) {
        db.addUser(user, index);
    }
    public void displayUsers() {
        db.displayUsers();
    }

    public void deleteUser(int index) {
        db.deleteUser(index);
    }

    public void updateUser(User user, int index) {
        db.updateUser(user, index);
    }

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
            System.out.println("DatabaseConnection instance created.");
        } else {
            System.out.println("DatabaseConnection instance already exists.");
        }
        return instance;
    }
}

// Programa principal
public class Singleton {
    public static void main(String[] args) {

        // Hacemos algunos test para verificar el patron Singleton en la clase DatabaseConnection
        
        System.out.println("Obteniendo instancia de DatabaseConnection por primera vez:\n");
        DatabaseConnection db1 = DatabaseConnection.getInstance();

        System.out.println("Obteniendo instancia de DatabaseConnection por segunda vez:\n");
        DatabaseConnection db2 = DatabaseConnection.getInstance();

        User user1 = new User("Alice", "alice@example.com", "password123");
        User user2 = new User("Bob", "bob@example.com", "password456");

        System.out.println("Agregando usuarios a la base de datos a traves de db1: \n");
        db1.addUser(user1, 0);
        db1.addUser(user2, 1);

        db1.displayUsers();

        System.out.println("Mostrando usuarios a traves de db2 (deberia mostrar los mismos usuarios): \n");
        db2.displayUsers();


        System.out.println("Eliminando usuario de la base de datos a traves de db2: \n");
        db2.deleteUser(0);
        System.out.println("Mostrando usuarios a traves de db1 despues de eliminar un usuario: \n");
        db1.displayUsers();
    }
}