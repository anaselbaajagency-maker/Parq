<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\MessageModel;
use CodeIgniter\API\ResponseTrait;

class MessageController extends BaseController
{
    use ResponseTrait;

    protected $messageModel;

    public function __construct()
    {
        $this->messageModel = new MessageModel();
    }

    public function index()
    {
        $userId = $this->request->userId;
        
        $messages = $this->messageModel->where('sender_id', $userId)
                                       ->orWhere('receiver_id', $userId)
                                       ->orderBy('created_at', 'desc')
                                       ->findAll();

        // Mapping to match Laravel's conversation grouping logic
        $conversations = []; 
        // Logic to group and pick latest message for each other user
        
        return $this->respond($conversations);
    }

    public function show($otherUserId)
    {
        $userId = $this->request->userId;
        
        $this->messageModel->where('sender_id', $otherUserId)
                           ->where('receiver_id', $userId)
                           ->where('read_at', null)
                           ->update(null, ['read_at' => date('Y-m-d H:i:s')]);

        $messages = $this->messageModel->groupStart()
                                         ->where('sender_id', $userId)
                                         ->where('receiver_id', $otherUserId)
                                       ->groupEnd()
                                       ->orGroupStart()
                                         ->where('sender_id', $otherUserId)
                                         ->where('receiver_id', $userId)
                                       ->groupEnd()
                                       ->orderBy('created_at', 'asc')
                                       ->findAll();

        return $this->respond($messages);
    }

    public function store()
    {
        $userId = $this->request->userId;
        $data = $this->request->getJSON(true);
        $data['sender_id'] = $userId;

        $id = $this->messageModel->insert($data);
        return $this->respondCreated($this->messageModel->find($id));
    }

    public function unreadCount()
    {
        $userId = $this->request->userId;
        return $this->respond(['count' => $this->messageModel->where('receiver_id', $userId)->where('read_at', null)->countAllResults()]);
    }
}
