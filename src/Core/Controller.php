<?php

namespace App\Core;

abstract class Controller {
    protected $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    protected function render($template, $data = []) {
        echo $this->twig->render($template, $data);
    }

    protected function json($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    protected function redirect($path) {
        header("Location: $path");
        exit;
    }
}