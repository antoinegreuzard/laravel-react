<?php

namespace Tests\Feature\Web;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testEditProfilePageIsAccessible()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/profile');

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Profile/Edit'));
    }

    public function testUpdateProfile()
    {
        $user = User::factory()->create();
        $data = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com'
        ];

        $response = $this->actingAs($user)->patch('/profile', $data);

        $response->assertRedirect('/profile');
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated Name']);
    }

    public function testDeleteProfile()
    {
        $user = User::factory()->create([
            'password' => bcrypt($password = 'correct-password'),
        ]);

        $data = [
            'password' => $password
        ];

        $response = $this->actingAs($user)->delete('/profile', $data);

        $response->assertRedirect('/');
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
