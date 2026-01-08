<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        // Validate the input
        $request->validate([
            'message' => 'required|string',
        ]);

        // ChatGPT API key from environment variable
        $apiKey = env('OPENAI_API_KEY');

        $client = new Client();
        $response = $client->post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $request->message,
                    ],
                ],
            ],
        ]);

        $data = json_decode($response->getBody(), true);
        $gptResponse = $data['choices'][0]['message']['content'];

        return response()->json(['response' => $gptResponse]);
    }
}
