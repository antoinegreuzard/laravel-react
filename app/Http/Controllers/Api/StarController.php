<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Star;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Illuminate\Http\JsonResponse
    {
        $stars = Star::all();
        return response()->json($stars);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'image' => 'nullable|image|max:1024',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('stars', 'public');
            $validated['image'] = asset('storage/' . $path);
        }

        $star = Star::create($validated);

        return response()->json($star, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Star $star): \Illuminate\Http\JsonResponse
    {
        return response()->json($star);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Star $star): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:1024',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('stars', 'public');
            $validated['image'] = asset('storage/' . $path);
        }

        $star->update($validated);

        return response()->json($star);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Star $star): \Illuminate\Http\JsonResponse
    {
        $star->delete();

        return response()->json(null, ResponseAlias::HTTP_NO_CONTENT);
    }
}
