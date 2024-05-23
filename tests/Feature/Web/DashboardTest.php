<?php

namespace Tests\Feature\Web;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function testDashboardIsAccessibleByAuthenticatedUsers()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Dashboard'));
    }

    public function testRedirectsIfNotAuthenticated()
    {
        $response = $this->get('/dashboard');

        $response->assertRedirect('/login');
    }
}
