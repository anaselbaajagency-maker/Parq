<?php

namespace App\Libraries;

use CodeIgniter\HTTP\CURLRequest;
use Config\Services;

class ApiClient
{
    protected string $baseUrl;
    protected CURLRequest $client;

    public function __construct()
    {
        $this->baseUrl = env('api.baseURL', 'http://localhost:8080/api/');
        $this->client = Services::curlrequest([
            'base_uri' => $this->baseUrl,
            'timeout'  => 5,
        ]);
    }

    /**
     * Send accurate GET/POST/PUT/DELETE requests to backend
     */
    public function request(string $method, string $endpoint, array $options = [])
    {
        $session = Services::session();
        $token = $session->get('jwt_token');

        if ($token) {
            $options['headers']['Authorization'] = 'Bearer ' . $token;
        }

        $options['headers']['Accept'] = 'application/json';
        $options['http_errors'] = false; // Handle errors manually

        try {
            $response = $this->client->request($method, $endpoint, $options);
            $body = json_decode($response->getBody(), true);
            
            return [
                'status' => $response->getStatusCode(),
                'data'   => $body,
                'error'  => $response->getStatusCode() >= 400 ? ($body['message'] ?? 'Unknown error') : null
            ];
        } catch (\Exception $e) {
            return [
                'status' => 500,
                'data'   => null,
                'error'  => $e->getMessage()
            ];
        }
    }

    public function get(string $endpoint, array $query = [])
    {
        return $this->request('GET', $endpoint, ['query' => $query]);
    }

    public function post(string $endpoint, array $data = [])
    {
        return $this->request('POST', $endpoint, ['json' => $data]);
    }
}
