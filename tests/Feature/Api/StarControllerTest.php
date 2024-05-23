<?php

namespace Tests\Feature\Api;

use App\Models\Star;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\User;

class StarControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testIndexReturnsDataInValidFormat()
    {
        Star::factory()->count(3)->create();

        $response = $this->getJson('/api/stars');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'first_name', 'description', 'image']
            ]);
    }

    public function testStarCanBeCreated()
    {
        $user = User::factory()->create();

        Storage::fake('public');

        $data = [
            'name' => 'John Doe',
            'first_name' => 'John',
            'description' => 'A brief description here.',
            'image' => UploadedFile::fake()->image('star.jpg')
        ];

        $response = $this->actingAs($user)->postJson('/api/stars', $data);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'John Doe',
                'first_name' => 'John'
            ]);
    }

    public function testShowStar()
    {
        $star = Star::factory()->create();

        $response = $this->getJson("/api/stars/{$star->id}");

        $response->assertStatus(200)
            ->assertJson($star->toArray());
    }

    public function testUpdateStar()
    {
        $user = User::factory()->create();
        $star = Star::factory()->create();
        $data = ['name' => 'Updated Name'];

        $response = $this->actingAs($user)->putJson("/api/stars/{$star->id}", $data);

        $response->assertStatus(200)
            ->assertJsonFragment($data);
    }

    public function testDeleteStar()
    {
        $user = User::factory()->create();
        $star = Star::factory()->create();

        $response = $this->actingAs($user)->deleteJson("/api/stars/{$star->id}");

        $response->assertStatus(204);
    }
}
