<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CategoryModel;
use CodeIgniter\API\ResponseTrait;

class CategoryController extends BaseController
{
    use ResponseTrait;

    protected $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new CategoryModel();
    }

    /**
     * GET /api/categories
     */
    public function index()
    {
        $type = $this->request->getVar('type');
        $activeOnly = $this->request->getVar('active') === 'true';

        $query = $this->categoryModel;
        if ($type) {
            $query = $query->where('type', $type);
        }
        if ($activeOnly) {
            $query = $query->where('is_active', true);
        }

        return $this->respond($query->orderBy('order', 'asc')->findAll());
    }

    /**
     * GET /api/categories/homepage
     */
    public function homepage()
    {
        return $this->respond($this->categoryModel->where('is_active', true)
                                              ->where('show_on_homepage', true)
                                              ->orderBy('order', 'asc')
                                              ->findAll());
    }

    /**
     * POST /api/admin/categories/bulk-homepage
     */
    public function bulkUpdateHomepage()
    {
        $data = $this->request->getJSON(true);
        $ids = $data['ids'] ?? [];

        $this->categoryModel->update(null, ['show_on_homepage' => false]);
        if (!empty($ids)) {
            $this->categoryModel->whereIn('id', $ids)->update(null, ['show_on_homepage' => true]);
        }

        return $this->respond(['message' => 'Homepage categories updated successfully']);
    }

    public function store()
    {
        $data = $this->request->getJSON(true);
        $id = $this->categoryModel->insert($data);
        return $this->respondCreated($this->categoryModel->find($id));
    }

    public function show($id)
    {
        $category = $this->categoryModel->find($id);
        return $category ? $this->respond($category) : $this->failNotFound();
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $this->categoryModel->update($id, $data);
        return $this->respond($this->categoryModel->find($id));
    }

    public function delete($id = null)
    {
        $this->categoryModel->delete($id);
        return $this->respondNoContent();
    }
}
