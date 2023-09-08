# ayudantia-api-gateway

## API Gateway

TO DO

## CORS

### Qué es CORS? (Cross-Origin Requests)

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) es un "mecanismo de seguridad" que el navegador impone cuándo envíamos un request a un backend que se encuentra alojado en un dominio diferente al frontend. Cuándo el frontend y el backend tienen el mismo dominio (ej: una app MVC en que las vista y controladores están servidos por el mismo servidor, como RoR), CORS no es "activado".

Para el contexto de CORS, las requests se dividen en dos categorías, `simple requests` y `preflighted requests`. Las `simple requests` son aquellas que no necesitan de la seguridad de CORS, por lo que funcionarán incluso si no nos preocupamos por configurar cors. Las `preflighted requests`, en cambio, son requests que sí requieren que CORS esté configurado, y si no lo está nos darán infinitos problemas.

El navegador es quién define que tipo de requests estamos realizando, es decir, nosotros no podemos evadir premeditadamente CORS sin configurarlo correctamente (En teoría. Si existen algunas formas de evadirlo, como cambiar la configuración del navegador, pero no son generalizables y no tiene sentido hacerlo si es que tenemos acceso al servidor para configurar CORS).

En esta documentación me centraré en las `preflighted requests`. Para saber cuáles son las `simple requests` (que no necesitan configuración) [pueden encontrar toda la info aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests), luego, las `preflighted requests` son todas aquellas que no son `simple requests`.


### Qué es el preflight

CORS consiste en que, cuándo el navegador tiene que hacer un request al backend, antes envíar el request original, "le pregunta" al backend si el request que va a envíar está permitido. Para esto se envía un request con método `OPTIONS` (en vez de GET, POST, DELETE, PUT, UPDATE), a la ruta original. El backend cuándo recibe el request con método `OPTONS`  responde con los headers CORS, que le indican al navegador lo que está permitido o no.

Los headers importantes para el proyecto son *`Access-Control-Allow-Origin`*, *`Access-Control-Allow-Credentials`*, *`Access-Control-Allow-Headers`*, *`Access-Control-Allow-Methods`*.

Una vez el navegador recibe estos headers, sabe si el request que va a realizar está permitido por el backend o no. Si está permitido, el navegador envía el request original y todo funciona como debería, si no está permitido, el navegador nos dará un error de cors y **no** enviará el request original.

A este request con método `OPTIONS` que se utiliza para preguntarle al backend qué está permitido y qué no, se le llama el `preflight`.

### Headers de configuración de CORS.

Para configurar CORS se deben modificar las respuestas del backend para que estos incluyan headers específicos (En general uno instala una librería de CORS en el servidor que nos entrega la configuración inicial y nosotros solo debemos pasar como parámetro que se puede hacer y qué no).

Los headers a configurar son:

- [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin): Este header puede tener un valor global o wildcard *`*`* o valores específicos como *`midominio.cl`* y básicamente indica desde qué rutas se pueden hacer llamados al backend. Si el valor es *`*`*, entonces cualquier dominio puede llamar al backend. Si utiliza algún dominio específico, cualquier request desde *otro* dominio le dará al cliente un error de cors.
  
- [`Access-Control-Allow-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers): Indica que headers están permitidos, y sus valores pueden ser el wildcard *`*`* o una lista de headers, ej: `Content-Type, Accept`.

- [`Access-Control-Allow-Methods`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods): Indica que methods están permitidos, y sus valores pueden ser el wildcard *`*`* o una lista de methods, ej: `GET, POST`.

- [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials): Puede tener valor `true` o `false` e indica si el request puede contener credenciales o no. Credenciales se consideran 'cookies', 'headers de autorización' (esto utilizaremos más adelante) y 'certificados TLS'. Además, el frontend debe enviar `request.credentials: include` en su request, parámetro que es configurable en todos los paquetes de requests típicos (ej: fetch o axios en JS). Además, cuándo se envían credenciales, los otros CORS headers no pueden usar el wildcard `*`.

### CORS Troubleshooting

[TROUBLESHOOTING MÁS GENERAL AQUÍ](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors)

**Troubleshooting específico del proyecto**

En nuestra implementación, nuevo frontend se comunicará con API Gateway, no con el servidor directamente, si bien API Gateway es solo el intermediario, nuestro frontend nunca conoce realmente al backend, ya que el request se lo manda al API Gateway, por lo tanto, para este proyecto la mayoría de los errores de CORS van a venir del API Gateway o de algún error de configuración en el frontend (De todas formas se debe instalar y configurar CORS en el back, pero es más probable que los errores que tengan sea por API Gateway).

- `Reason: CORS header 'Access-Control-Allow-Origin' missing`: 
  - Posible error: Falta configurar el Allow Origin en API Gateway. En AWS ir a 'API Gateway', seleccionen su API, presionen el recurso que les dá error, asegurense de que CORS esté activado (Actions -> Enable CORS), y en el form que aparece en `Access-Control-Allow-Origin` colo '*' o 'midominio.cl'. Aquí es importante que el parámetro esté encapsulado entre comillas simples.
  - Otro posible error: Tienen mal configurado el manejo de errores en API Gateway y hay un error en su servidor. Si hay un error en el servidor, entonces el servidor le retorna un error al API Gateway. Los CORS para los errores se  tienen que configura a parte de la ruta misma, entonces si el API Gateway recibe un error del backend (ej: el backend se cae y retorna error 500), si CORS para el error 500 no está configurado, API Gateway no retornará ese mensaje de error al backend si no que retornará algún error de CORS. Para configurar CORS en los errores ingresen a API Gateway, seleccionen su api, vayan a 'Gateway Responses' y ahí configuren, por lo menos, 'Default 4XX' y 'Default 5XX'.

- `Reason: Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is '*'`: TODO
- `Reason: Did not find method in CORS header 'Access-Control-Allow-Methods'`: TODO
- `Reason: expected 'true' in CORS header 'Access-Control-Allow-Credentials'`: TODO
