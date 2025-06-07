![routemap](https://github.com/user-attachments/assets/f6b7745a-6ade-4ad1-9b05-fcbd5221e4ea)

# RouteMap

## Overview

**RouteMap** is a Visual Studio Code extension designed to help **Laravel** developers visualize their application routes in an interactive graph format. This extension renders routes, their HTTP methods, URIs, controllers, middlewares, and relationships as a dynamic graph. This visualization makes understanding route flow, middleware application, and controller connections intuitive and efficient.

The extension supports filtering routes by URI patterns, enabling quick navigation and focused analysis of specific route groups.

---

## Features

- Visualize Laravel routes as an interactive graph.
- Display HTTP methods, URIs, controllers, and middleware relationships.
- Filter routes by URI to narrow down displayed nodes.
- Seamlessly integrates with Laravel projects by executing `php artisan route:list --json` internally.
- Lightweight and easy to use within Visual Studio Code.
- Improves route comprehension for maintenance and debugging.

---

## Examples

![image](https://github.com/user-attachments/assets/8ed79dcf-4c5a-443b-bae6-0cb2d6bf8746)

![image](https://github.com/user-attachments/assets/39fce3c1-0b4f-448e-8198-201de388b384)

---

## Installation

You can install **RouteMap** in Visual Studio Code by either:

- Downloading the .vsix package and installing it via the Extensions pane's "Install from VSIX..." option.

- Or more conveniently, by downloading it directly from the Visual Studio Code Marketplace.

---

## Usage

1. **Open a Laravel project folder in Visual Studio Code**. This folder should contain the `artisan` file and the routes directory (e.g., `routes/web.php`).

2. Open the Command Palette by pressing:

    ```
    Ctrl + Shift + P
    ```

3. Type the command:

    ```
    Mostrar Rutas Laravel
    ```

4. Select the command when it appears.

5. The extension will execute the Laravel Artisan command to fetch the routes data:

    ```
    php artisan route:list --json
    ```

6. An interactive graph panel will open showing all your routes as nodes connected by their relationships.

7. Use the filter input to search and narrow routes by URI patterns.

---

Thank you for using Laravel RouteMap to better understand and visualize your Laravel routes.
