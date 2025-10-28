<?php

namespace App\Controllers;

use App\Core\Controller;

class HomeController extends Controller {
    public function index() {
        $features = [
            ['title' => 'Easy Ticketing', 'description' => 'Create, edit and track tickets easily'],
            ['title' => 'Dashboard View', 'description' => 'Easy to monitor and check open and closed tickets'],
            ['title' => 'Secure Access', 'description' => 'Secured workflows and account']
        ];

        return $this->render('index.html.twig', [
            'current_page' => 'home',
            'features' => $features
        ]);
    }
}