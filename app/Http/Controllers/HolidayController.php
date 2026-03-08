<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
class HolidayController extends Controller {
    public function index() { return Inertia::render('SystemSettings/Index'); }
}