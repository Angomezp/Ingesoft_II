# Curso: Ingeniería de Software II
# - Laboratorio REST por consola y SSH

### Estudiante:  Ángel David Gómez Pastrana
## Descripción del trabajo 

Primero completamos los to-do en el archivo de `servidor.js`,  para el primer endpoint quedo asi:

- ![todo_1](images/todo_img1.png)

Y para el segundo endpoint:

- ![todo_2](images/todo_img2.png)

Ponemos a correr el servidor en una terminal propia con: `node server.js` desde este root y ahora revisamos y validamos los endpoints con los siguientes comandos:



**Resumen de pasos y comandos**

- Registro de usuario — POST /auth/register, Login y obtención de token — POST /auth/login

	- Comando Registro (PowerShell): `Invoke-RestMethod -Method POST -Uri http://localhost:3000/auth/register -ContentType "application/json" -Body '{"username":"ana","email":"ana@test.com","password":"1234"}'`
    - Comando Login (PowerShell): `$Invoke-RestMethod -Method POST -Uri http://localhost:3000/auth/login -ContentType "application/json" -Body '{"email":"ana@test.com","password":"1234"}'`

    ![commands_1](images/commands_1.png)


- Guardado y verificacion del token POST /auth/login 
  - Comando Guardado(PowerShell): `$token = (Invoke-RestMethod -Method POST -Uri http://localhost:3000/auth/login -ContentType "application/json" -Body 	'{"email":"ana@test.com","password":"1234"}').token`
  - Comando verificacion (PowerShell): `$token` 
  
  ![commands_2](images/commands_2.png) 

- Listar tareas con y sin token — GET /tasks (requiere token)
    - Comando sin token (Powershell): `Invoke-RestMethod -Method GET -Uri http://localhost:3000/tasks` 
	- Comando con token (PowerShell): `Invoke-RestMethod -Method GET -Uri http://localhost:3000/tasks -Headers @{Authorization="Bearer $token"}`
 ![commands_3](images/commands_3.png)

- Crear tarea en variable, verificar variable y actualizar / eliminar tareas, por ultimo listar.
	- Crear (POST): `$tarea = (Invoke-RestMethod -Method POST -Uri http://localhost:3000/tasks -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body '{"title":"Estudiar JWT","description":"Practicar"}')`
	- Verificar: `$tarea`
	- Actualizar (PUT): `Invoke-RestMethod -Method PUT -Uri http://localhost:3000/tasks/$($tarea.id) -Headers @{Authorization="Bearer $token"; "Content-Type"="application/json"} -Body (@{title="Actualizada"; status="completed"} | ConvertTo-Json)` 
	- Eliminar (DELETE): `Invoke-RestMethod -Method DELETE -Uri http://localhost:3000/tasks/$($tarea.id) -Headers @{Authorization="Bearer $token"}`
	- Listar: `Invoke-RestMethod -Method GET -Uri http://localhost:3000/tasks -Headers @{Authorization="Bearer $token"}`
  
  ![commands_4](images/commands_4.png)






Luego de terminar esto, modificamos el servidor para que escuche en toda la red, de esta forma:

| Antes | Despues |
|--------------|--------------|
| ![changes_before](images/changes_1.png)    | ![changes_after](images/changes_2.png)     |

Y desde una terminal, corremos el servidor con `node server.js` desde este root.
