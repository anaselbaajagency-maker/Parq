<?php

namespace App\Controllers;

class Language extends BaseController
{
    public function index($locale)
    {
        $session = session();
        $session->set('locale', $locale);
        return redirect()->back();
    }
}
