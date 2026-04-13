# Curso: Ingeniería de Software II
# - Laboratorio GraphQL con Postman

### Estudiante:  Ángel David Gómez Pastrana
## Descripcion del trabajo en Postman

Para esta practica, la API que se uso fue la API de [Countries GraphQL](https://countries.trevorblades.com/) de Trevor Blades, la cual es una API de uso practico para aprender a usar GraphQL y su tipo de consultas. Esta API trae informacion de continentes y paises, la cual esta totalmente disponible para hacer cualquier tipo de consultas.

| Request | ¿De qué se trata? | Código de respuesta | Test |
|---|---|---|---|
| **1** | Buscar todos los paises disponibles, y su codigo. | ![Request-1_Response](images/R1_Response.png) | ![Request-1_Test](images/R1_Test.png) |
| **2** | Busqueda filtrada por un codigo especifico usado como variable, de un pais y obtener su capital, codigo, moneda y nombre. | ![Request-2_Response](images/R2_Response.png) | ![Request-2_Test](images/R2_Test.png) |
| **3** | Busqueda Filtrada de un continente en especifico, pasado explicitamente en la busqueda e informacion anidada sobre los paises de este continente.| ![Request-3_Response](images/R3_Response.png) | ![Request-3_Test](images/R3_Test.png) |
| **4** | Busqueda anidada de los lenguajes de los paises disponibles, junto con la capital,codigo,monedas, nombre y nombre del pais en su lenguaje nativo. | ![Request-4_Response](images/R4_Response.png) | ![Request-4_Test](images/R4_Test.png) |
| **5** | Obtener el lengguaje de los paises de un continente especifico, el cual, el codigo del continente es pasado explicitamente en el query. | ![Request-5_Response](images/R5_Response.png) | ![Request-5_Test](images/R5_Test.png) |

### Nota: 
En caso de que las imágenes se vean muy pequeñas, estas se encuentran en la carpeta `/images` donde su nombre es ``R{i}_Test`` o  ``R{i}_Response``, que significa que es la captura del request i, la parte del test o de response.

##  ¿Qué diferencia encontraste vs REST?

En contraste con REST, podemos ver que GraphQL tiene muchas diferencias, para empezar GraphQL usa una misma URL y un mismo endpoint para todas las querys, mientras que REST debe tener un endpoint para cada request pero a favor de REST, esta request le puedes cambiar su tipo, y creo que eso es util cuando se necesita editar o eliminar informacion a traves del endpoint que estas usando. Otra diferencia clave es que en REST es el servidor el cual te manda la informacion, esto hace que usualmente sean o mas datos de los cuales se necesitan, o menos, esto causa un uso innecesario de recursos como red y tiempo, ademas puede requerir el uso de mas de una consulta para conseguir toda la informacion necesaria, mientras en GraphQL se piden los datos necesarios y es el usuario quien decide que necesita y que no. 

Tambien se puede agregar que GraphQL permite busquedas anidadas muy sencillamente mientras que en REST hay que tener cuidado con los parametros enviados en la query, pero podemos decir que un punto a favor de rest es que el body del query es mucho mas sencillo de armar.

Podemos decir que en general REST es mas sencillo al inicio y mas entendible de usar, mientras que GraphQL es un sistema mas eficiente pero que requiere un poco mas de entendimiento de como usarlo correctamente.

## ¿Cuántos requests REST necesitarías para reemplazar tu query más compleja?

Mi query mas compleja es la query 5, es obtener el lenguaje de los paises de un continente especifico, el cual, el codigo del continente es pasado explicitamente en el query, pero para determinar cuantas request REST se necesitaria para obtener la misma query podemos decir que depende como este armada la API REST, pues podria ser una sola query si se maneja como parametros de la query por ejemplo traer los paises de dado continente y por ende traer toda su informacion consigo, pero esto nos daria mucha mas informacion de lo que necesitamos y luego nos tocaria filtrarla. Otra opcion es que nos tocara hacer una query por anidacion, es decir en un supuesto endpoint `continent/SA/` necesitaria una query para traer los paises y otra para traer los lenguajes. Asi que al menos sabemos que son 2 o mas request pero igual habria que filtrar informacion para que fuera exactamente igual. Por tanto en este caso GraphQL hace un trabajo mas eficiente.

## ¿En qué proyecto real usarías GraphQL?

Ya vimos que GraphQL es mejor cuando los datos son complejos, hay muchas relaciones y distintas variables, por lo tanto en proyectos que cumplan estas caracteristicas, por ejemplo aplicaciones de tipo red social, aplicaciones de tipo comercio electronico que necesitan informacion relacionada que no seria facil de sacar a traves de request de tipo REST o por ejemplo aplicaciones de celular en las cuales la red pueda ser un problema, dada la eficiencia en cuestion de elementos como red y tiempo.