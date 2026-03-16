<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CityModel;
use CodeIgniter\API\ResponseTrait;

class CityController extends BaseController
{
    use ResponseTrait;

    protected $cityModel;

    public function __construct()
    {
        $this->cityModel = new CityModel();
    }

    public function index()
    {
        $activeOnly = $this->request->getVar('active') === 'true';
        $query = $this->cityModel;
        if ($activeOnly) {
            $query = $query->where('is_active', true);
        }
        return $this->respond($query->findAll());
    }

    public function store()
    {
        $data = $this->request->getJSON(true);
        $id = $this->cityModel->insert($data);
        return $this->respondCreated($this->cityModel->find($id));
    }

    public function show($id)
    {
        $city = $this->cityModel->find($id);
        return $city ? $this->respond($city) : $this->failNotFound();
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $this->cityModel->update($id, $data);
        return $this->respond($this->cityModel->find($id));
    }

    public function delete($id = null)
    {
        $this->cityModel->delete($id);
        return $this->respondNoContent();
    }
}
