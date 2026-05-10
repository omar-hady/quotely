<?php
/**
 * API endpoint: return a random quote as JSON.
 * GET /api/random_quote.php
 */

require_once __DIR__ . '/../includes/functions.php';

header('Content-Type: application/json; charset=utf-8');

$quote = get_random_quote();

if ($quote === null) {
    http_response_code(404);
    echo json_encode(['error' => 'No quotes found']);
    exit;
}

echo json_encode($quote);
