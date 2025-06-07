# RouteMap - Laravel Route Coverage Visualizer

RouteMap es una extensión para Visual Studio Code que visualiza gráficamente las rutas de un proyecto Laravel y su relación con controladores, middlewares, permisos y tests.

## Características principales

- 🎯 Vista en árbol interactiva de rutas y controladores
- 🛡️ Visualización de middlewares por ruta
- 🧪 Pruebas asociadas a rutas (si las detecta)
- 📦 Exportación de grafo como PNG (pro)
- 🌐 Filtrado por método HTTP, URI o middleware

## Comando

- `Mostrar Rutas Laravel`: genera el grafo de rutas desde el archivo `routes/web.php`

## Instalación

1. Abre VSCode
2. Instala esta extensión desde archivo `.vsix`:
   ```sh
   code --install-extension routemap-0.0.1.vsix
