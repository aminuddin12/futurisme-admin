<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/Resources/svg/FuturismeLogo-admin-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="src/Resources/svg/FuturismeLogo-admin-light.svg">
    <img alt="Futurisme Admin Logo" src="src/Resources/svg/FuturismeLogo-admin-light.svg" width="550">
  </picture>
</p>

<p align="center">
    <strong>Futurisme Admin Panel for Laravel 12</strong><br>
    A robust, modern, and plug-and-play admin panel package architected with Inertia.js, React, and Tailwind CSS.
</p>

<p align="center">
    <a href="README.id.md">🇮🇩 Baca Dokumentasi Bahasa Indonesia</a>
</p>

<p align="center">
    <a href="https://laravel.com"><img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat-square&logo=laravel" alt="Laravel 12"></a>
    <a href="https://inertiajs.com"><img src="https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=flat-square&logo=inertia" alt="Inertia.js"></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react" alt="React"></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
</p>

---

## 🚀 About

**Futurisme Admin** is a comprehensive, plug-and-play solution designed to handle admin panel requirements efficiently. It is architected to remain completely isolated from your main Laravel application's frontend, ensuring that your public-facing site and your administrative dashboard do not conflict.

By leveraging a modern technology stack, this package provides a seamless Single Page Application (SPA) experience without the complexity of building a separate API. It comes equipped with a secure authentication system, a fully responsive dashboard layout, and an isolated asset management pipeline, making it the perfect starting point for building complex administrative tools.

### Key Features

* **One Command Installation**:
    Streamline your workflow with a single artisan command. The installation process handles everything from publishing compiled assets and configuring dependencies to running the necessary database migrations, getting you up and running in seconds.

* **Fully Isolated Environment**:
    Assets (CSS/JS) and Views are encapsulated within the package. This means the admin panel's Tailwind configuration, React components, and styling will **not pollute or conflict** with your main application's frontend framework, allowing for a clean separation of concerns.

* **Modern Tech Stack**:
    Built on the latest standards:
    * **Laravel 12**: For a powerful, secure, and scalable backend.
    * **Inertia.js**: To build a modern SPA using classic server-side routing concepts.
    * **React 18**: For building interactive and reusable UI components.
    * **Tailwind CSS**: For utility-first, rapid UI styling.

* **Auto-Configured Tooling**:
    Essential tools like **Ziggy** (for using Laravel named routes inside JavaScript) and **Tailwind CSS** are pre-configured out of the box. You don't need to manually set up webpack mix or vite configurations for the admin panel.

* **Separated Database Schema**:
    Security is a priority. The package uses a dedicated `futurisme_admins` table for administrative users. This separation ensures that admin credentials and logic never overlap with your regular `users` table, providing an extra layer of security and data integrity.

## 📦 Installation

Since this is a custom (private/local) package, ensure you have registered it in your main application's `composer.json` or installed it via a configured private repository.

### Prerequisites
Ensure your environment meets the following requirements before proceeding:
* PHP ^8.2
* Laravel 10, 11, or 12
* Node.js & NPM (for rebuilding assets if necessary)

### 1. Require Package

Run the following command in your Laravel project terminal to add the package dependency:

```bash
composer require aminuddin12/futurisme-admin
````

*(Note: If this package has not been published to Packagist, verify that you have added the local path or VCS repository configuration in your main `composer.json` file).*

### 2\. Run Install Command

Simply run this single command to bootstrap the package. This command performs a series of automated tasks: downloading required dependencies (like Ziggy), publishing the pre-compiled build assets to your public directory, and executing the migration files.

```bash
php artisan install:futurisme-admin
```

> **Note:** This command checks for the presence of `tightenco/ziggy`. If it is missing, the installer will automatically run `composer require tightenco/ziggy` for you.

## 🛠️ Usage

After the installation process is complete, the admin panel is ready to use immediately.

### Accessing Pages

Open your browser and navigate to the following URLs to interact with the admin panel:

  * **Login Page**: `/login` (This route is registered within the package's `routes/web.php` and creates a session on the `futurisme` guard).
  * **Dashboard**: `/` (Accessible only after successful authentication).

### Creating a New Admin

To ensure security, the package does not ship with a default "admin/admin" user. You must create your first administrative user manually via the database or using Laravel Tinker.

Run Tinker in your terminal:

```bash
php artisan tinker
```

Then execute the following PHP code to seed your first super admin:

```php
\Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin::create([
    'name' => 'Super Admin',
    'email' => 'admin@futurisme.com',
    'password' => 'password', // The model automatically hashes this password
    'is_super_admin' => true, // Grants full access privileges
]);
```

Once created, use the email `admin@futurisme.com` and password `password` to log in to the dashboard. **It is highly recommended to change this password immediately after your first login.**

## 📂 Important Folder Structure

Understanding the package structure can help if you need to customize or debug:

  * **Configs (`config/auth.php`)**:
    The ServiceProvider automatically injects the necessary Guard and Provider configurations here at runtime, so you don't need to edit your app's config manually.

  * **Assets (`public/vendor/futurisme-admin/`)**:
    This directory contains the production-ready, compiled Vite build output (JS and CSS). These are the files served to the browser.

  * **Views (`src/Resources/views/app.blade.php`)**:
    The root Blade template that initializes the Inertia app. It includes the necessary meta tags and script references.

  * **Migrations (`src/Database/Migrations/`)**:
    Contains the blueprint for the `futurisme_admins` table and other package-specific schemas.

## 🔧 Troubleshooting

If you experience layout issues (missing styles), 404 errors on assets, or JavaScript console errors, follow these steps:

1.  **Rebuild Assets (Development Mode)**
    If you have modified the source files, navigate to the package folder and rebuild the assets:

    ```bash
    cd vendor/aminuddin12/futurisme-admin
    npm install && npm run build
    ```

2.  **Republish Assets**
    If the public assets were deleted or corrupted, go back to the project root and rerun the install command to refresh them:

    ```bash
    php artisan install:futurisme-admin
    ```

3.  **Clear Caches**
    Laravel caches views and routes aggressively. If you don't see your changes, clear the caches:

    ```bash
    php artisan view:clear
    php artisan route:clear
    ```

## 📄 License

This package is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute it as per the license terms.
