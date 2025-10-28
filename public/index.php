<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Router;
use App\Controllers\HomeController;
use App\Controllers\AuthController;
use App\Controllers\DashboardController;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Set up Twig
$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new \Twig\Environment($loader, [
    'cache' => __DIR__ . '/../cache',
    'debug' => $_ENV['APP_ENV'] === 'development'
]);

// Add custom Twig functions
$twig->addFunction(new \Twig\TwigFunction('asset', function ($path) {
    return '/public/' . ltrim($path, '/');
}));

$twig->addFunction(new \Twig\TwigFunction('path', function ($name, $params = []) {
    // Simple route generation
    $routes = [
        'home' => '/',
        'login' => '/login',
        'signup' => '/signup',
        'dashboard' => '/dashboard',
        'tickets' => '/tickets',
        'logout' => '/logout'
    ];
    
    return $routes[$name] ?? '/';
}));

// Create router
$router = new Router($twig);

// Define routes
$router->add('GET', '/', HomeController::class, 'index');
$router->add('GET', '/login', AuthController::class, 'loginForm');
$router->add('POST', '/login_check', AuthController::class, 'login');
$router->add('GET', '/signup', AuthController::class, 'signupForm');
$router->add('POST', '/signup_submit', AuthController::class, 'signup');
$router->add('GET', '/dashboard', DashboardController::class, 'index');
$router->add('GET', '/api/dashboard', DashboardController::class, 'apiData');
$router->add('POST', '/logout', AuthController::class, 'logout');

// Dispatch the request
$router->dispatch();