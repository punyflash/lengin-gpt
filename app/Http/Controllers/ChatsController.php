<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatsController extends Controller
{
    public function index()
    {
        return Inertia::render('Chats/Index', [
            'model' => fn () => config('openai.model'),
        ]);
    }
}
