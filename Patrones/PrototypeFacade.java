// El patrón Prototype es un patrón de diseño creacional que permite crear nuevos objetos a partir de una instancia prototipo existente.
// Se puede pensar en el patrón Prototype como una forma de clonar objetos, 
// lo que puede ser útil cuando la creación de un nuevo objeto es costosa 
// en términos de tiempo, recursos o complejidad.


// El patrón Facade es un patrón de diseño estructural que proporciona 
// una interfaz simplificada para un conjunto de funciones en un subsistema.


// Juntos, pueden ser usados por ejemplo en Machine Learning, donde el patron Prototype
// se puede usar para clonar modelos de ML, y el patron Facade se puede usar para
// proporcionar una interfaz simplificada para entrenar, evaluar y usar los modelos de ML.


class RegressionModelExample {
    private String modelName;
    private final double[] W;
    private final double b;
    private double learningRate;


    public RegressionModelExample(String modelName, double learningRate, double[] initialParameters, double initialBias) {
        this.modelName = modelName;
        this.learningRate = learningRate;
        this.W = initialParameters;
        this.b = initialBias;
    }

    public void train( double[] data, int iterations) {

        System.out.println("Training regression model: " + modelName);

        // Simulación de entrenamiento del modelo, ajustando los parámetros
        for(int j = 0; j < iterations; j++) {
            double[] gradient = gradientDescent(data);
            for (int i = 0; i < this.W.length; i++) {
                this.W[i] = this.W[i] - this.learningRate * gradient[i]; // Simulación de entrenamiento
            }
        }
        //... código de entrenamiento real aquí...
        //... Largo y tedioso .....
        
        System.err.println("Modelo entrenado, parámetros ajustados");
    }

    private double[] gradientDescent( double[] data) {
        double[] gradients = new double[this.W.length];

        int limit = Math.min(data.length, this.W.length);

        for (int i = 0; i < limit; i++) {
            gradients[i] = this.W[i] + 0.01; // Simulación de ajuste de parámetros
        }
        return gradients; // Simulación de parámetros ajustados
    }

    public double evaluate( double[] testData) {
        System.out.println("Evaluating regression model: " + modelName);

        //... Mas código de evaluación real aquí...
        return 5.0; // Simulación de evaluación del modelo, retornando una métrica de rendimiento

    }

    public void predict( double[] inputData) {
        System.out.println("Predicting with regression model: " + modelName);

        //... Código de predicción real aquí...
        System.out.println("Predicción realizada con éxito");

    }

    public RegressionModelExample cloneModel() {
        return new RegressionModelExample(this.modelName, this.learningRate, this.W.clone(), this.b);
    }

    //getters y setters aquí...

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public double[] getParameters() {
        return W;
    }

    public double getLearningRate() {
        return learningRate;
    }

    public double getBias() {
        return b;
    }

    public void setLearningRate(double learningRate) {
        this.learningRate = learningRate;
    }
}


public class PrototypeFacade {
    public static void main(String[] args) {

        // Crear un modelo de regresión prototipo
        RegressionModelExample prototypeModel = new RegressionModelExample("Linear Regression", 0.01, new double[]{0.5, 0.5}, 0.0);
    
        // Clonar el modelo prototipo para crear un nuevo modelo
        RegressionModelExample clonedModel = prototypeModel.cloneModel();
    
        // Entrenar el modelo clonado con datos de entrenamiento
        double[] trainingData = {1.0, 2.0, 3.0}; // Simulación de datos de entrenamiento
        clonedModel.train(trainingData, 100);
    
        // Evaluar el modelo clonado con datos de prueba
        double[] testData = {1.5, 2.5}; // Simulación de datos de prueba
        clonedModel.evaluate(testData);
    
        // Hacer predicciones con el modelo clonado
        double[] inputData = {1.0, 2.0}; // Simulación de datos de entrada para predicción
        clonedModel.predict(inputData);

        //puedo entrenar un modelo mas veces y comparar, etc..

        clonedModel.train(trainingData, 50);
        clonedModel.evaluate(testData);
        
        // Podria copiarse el modelo obteniendo cada valor por aparte, 
        // Pero en un modelo mas complejo, podria tornarse tedioso el proceso.
        // Con este metodo podria ir haciendo guardados del modelo
        // asi entrenar en distintas etapas, y comparar resultados, etc...
    }
}
