<?php

namespace App\Controllers;

use App\Core\Controller;

class AuthController extends Controller {
    public function loginForm() {
        return $this->render('login.html.twig', [
            'current_page' => 'login'
        ]);
    }

    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['_username'] ?? '';
        $password = $data['_password'] ?? '';

        // TODO: Implement proper authentication
        if ($email === 'demo@ticketflow.com' && $password === 'demo123') {
            $_SESSION['user'] = [
                'id' => 1,
                'email' => $email,
                'firstName' => 'Demo',
                'lastName' => 'User'
            ];
            return $this->json(['success' => true, 'redirect' => '/dashboard']);
        }

        return $this->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    public function signupForm() {
        return $this->render('signup.html.twig', [
            'current_page' => 'signup'
        ]);
    }

    public function signup() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // TODO: Implement proper user registration
        // For now, just return success
        return $this->json([
            'success' => true,
            'redirect' => '/login'
        ]);
    }

    public function logout() {
        session_destroy();
        return $this->json([
            'success' => true,
            'redirect' => '/login'
        ]);
    }
}