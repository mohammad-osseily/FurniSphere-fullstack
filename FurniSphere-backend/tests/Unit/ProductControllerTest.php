<?php

namespace Tests\Unit;

use App\Http\Controllers\ProductController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Tests\TestCase;
use Mockery;

class ProductControllerTest extends TestCase
{
    public function tearDown(): void
    {
        Mockery::close();
    }

    public function test_index_returns_paginated_products()
    {
        // Arrange
        $controller = new ProductController();
        $request = new Request();

        // Create a mock of the Product model
        $productMock = Mockery::mock('overload:' . Product::class);

        // Set up the expectation for the paginate method
        $productMock->shouldReceive('paginate')
            ->once()
            ->with(10)
            ->andReturn(new LengthAwarePaginator(
                $this->getFakeProducts(10),
                15,
                10,
                1
            ));

        // Act
        $response = $controller->index($request);

        // Assert
        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // Check if the response contains the correct structure
        $this->assertArrayHasKey('current_page', $data);
        $this->assertArrayHasKey('data', $data);
        $this->assertArrayHasKey('first_page_url', $data);
        $this->assertArrayHasKey('from', $data);
        $this->assertArrayHasKey('last_page', $data);
        $this->assertArrayHasKey('last_page_url', $data);
        $this->assertArrayHasKey('links', $data);
        $this->assertArrayHasKey('next_page_url', $data);
        $this->assertArrayHasKey('path', $data);
        $this->assertArrayHasKey('per_page', $data);
        $this->assertArrayHasKey('prev_page_url', $data);
        $this->assertArrayHasKey('to', $data);
        $this->assertArrayHasKey('total', $data);

        // Check if the pagination is working correctly
        $this->assertEquals(1, $data['current_page']);
        $this->assertCount(10, $data['data']); // 10 items per page
        $this->assertEquals(15, $data['total']); // Total 15 items
        $this->assertEquals(2, $data['last_page']); // 2 pages in total
    }

    public function test_index_returns_empty_page_when_no_products()
    {
        // Arrange
        $controller = new ProductController();
        $request = new Request();

        // Create a mock of the Product model
        $productMock = Mockery::mock('overload:' . Product::class);

        // Set up the expectation for the paginate method
        $productMock->shouldReceive('paginate')
            ->once()
            ->with(10)
            ->andReturn(new LengthAwarePaginator(
                [],
                0,
                10,
                1
            ));

        // Act
        $response = $controller->index($request);

        // Assert
        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // Check if the response contains the correct structure
        $this->assertArrayHasKey('current_page', $data);
        $this->assertArrayHasKey('data', $data);
        $this->assertArrayHasKey('first_page_url', $data);
        $this->assertArrayHasKey('from', $data);
        $this->assertArrayHasKey('last_page', $data);
        $this->assertArrayHasKey('last_page_url', $data);
        $this->assertArrayHasKey('links', $data);
        $this->assertArrayHasKey('next_page_url', $data);
        $this->assertArrayHasKey('path', $data);
        $this->assertArrayHasKey('per_page', $data);
        $this->assertArrayHasKey('prev_page_url', $data);
        $this->assertArrayHasKey('to', $data);
        $this->assertArrayHasKey('total', $data);

        // Check if the pagination is empty
        $this->assertEquals(1, $data['current_page']);
        $this->assertCount(0, $data['data']); // No items
        $this->assertEquals(0, $data['total']); // Total 0 items
        $this->assertEquals(1, $data['last_page']); // 1 empty page
    }

    private function getFakeProducts($count)
    {
        $products = [];
        for ($i = 1; $i <= $count; $i++) {
            $products[] = [
                'id' => $i,
                'name' => "Product $i",
                'description' => "Description for Product $i",
                'price' => rand(100, 10000) / 100,
            ];
        }
        return $products;
    }
}
