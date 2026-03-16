<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\SettingModel;
use CodeIgniter\API\ResponseTrait;

class SettingController extends BaseController
{
    use ResponseTrait;

    protected $settingModel;

    public function __construct()
    {
        $this->settingModel = new SettingModel();
    }

    public function index()
    {
        $settings = $this->settingModel->findAll();
        $result = [];
        foreach ($settings as $setting) {
            $result[$setting['key']] = $setting['value'];
        }
        return $this->respond($result);
    }

    public function bulkUpdate()
    {
        $data = $this->request->getJSON(true);
        foreach ($data as $key => $value) {
            $val = is_array($value) ? json_encode($value) : (string)$value;
            $existing = $this->settingModel->where('key', $key)->first();
            if ($existing) {
                $this->settingModel->update($existing['id'], ['value' => $val]);
            } else {
                $this->settingModel->insert(['key' => $key, 'value' => $val]);
            }
        }
        return $this->respond(['message' => 'Settings updated successfully']);
    }
}
