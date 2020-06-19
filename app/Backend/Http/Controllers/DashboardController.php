<?php

namespace Backend\Http\Controllers;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    /**
     * create an instance of the controller.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view('backend.dashboard');
    }
}
