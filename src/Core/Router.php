<?php

namespace App\Core;

class Router {
    private $routes = [];
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function add($method, $path, $controller, $action) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'controller' => $controller,
            'action' => $action
        ];
    }

    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $this->matchPath($route['path'], $path, $params)) {
                $controller = new $route['controller']($this->twig);
                return call_user_func_array([$controller, $route['action']], $params);
            }
        }

        http_response_code(404);
        echo $this->twig->render('error/404.html.twig');
    }

    private function matchPath($routePath, $requestPath, &$params = []) {
        $routeParts = explode('/', trim($routePath, '/'));
        $requestParts = explode('/', trim($requestPath, '/'));

        if (count($routeParts) !== count($requestParts)) {
            return false;
        }

        $params = [];
        for ($i = 0; $i < count($routeParts); $i++) {
            if (strpos($routeParts[$i], ':') === 0) {
                $params[] = $requestParts[$i];
            } elseif ($routeParts[$i] !== $requestParts[$i]) {
                return false;
            }
        }

        return true;
    }
}