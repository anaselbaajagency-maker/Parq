<?php

namespace App\Controllers;

class Auth extends BaseController
{
    public function login()
    {
        if ($this->request->getMethod() === 'post') {
            $email = $this->request->getPost('email');
            $password = $this->request->getPost('password');

            $result = $this->api->post('login', [
                'email'    => $email,
                'password' => $password
            ]);

            if ($result['status'] === 200) {
                $session = session();
                $session->set('jwt_token', $result['data']['token']);
                $session->set('user', $result['data']['user']);
                
                return redirect()->to('tableau-de-bord')->with('message', 'Bienvenue !');
            }

            return redirect()->back()->with('error', $result['error'] ?? 'Identifiants invalides');
        }

        return view('pages/auth/login', ['title' => 'Connexion - Parq']);
    }

    public function register()
    {
        if ($this->request->getMethod() === 'post') {
            $data = $this->request->getPost();
            $result = $this->api->post('register', $data);

            if ($result['status'] === 201 || $result['status'] === 200) {
                return redirect()->to('login')->with('message', 'Compte créé ! Connectez-vous.');
            }

            return redirect()->back()->with('error', $result['error'] ?? 'Erreur lors de l’inscription');
        }

        return view('pages/auth/register', ['title' => 'Inscription - Parq']);
    }

    public function logout()
    {
        session()->destroy();
        return redirect()->to('/')->with('message', 'Déconnecté');
    }
}
