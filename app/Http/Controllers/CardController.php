<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CardController extends Controller
{
    public function linkCard(Request $request)
    {
        return to_route('dashboard');
    }
}
