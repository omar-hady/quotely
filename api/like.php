<?php
/**
 * API endpoint: toggle like on a quote.
 * POST /api/like.php  { quote_id: int, csrf_token: string }
 * Returns JSON.
 */

require_once __DIR__ . '/../includes/functions.php';

header('Content-Type: application/json; charset=utf-8');

// Only accept POST requests.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Must be logged in.
if (!is_logged_in()) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit;
}

// Parse JSON body or fall back to POST fields.
$body = [];
$raw  = file_get_contents('php://input');
if ($raw) {
    $body = json_decode($raw, true) ?? [];
}

$quoteId   = isset($body['quote_id'])   ? (int) $body['quote_id']   : (int) ($_POST['quote_id']   ?? 0);
$csrfToken = isset($body['csrf_token']) ? (string) $body['csrf_token'] : (string) ($_POST['csrf_token'] ?? '');

// Validate CSRF.
if (!verify_csrf($csrfToken)) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid CSRF token']);
    exit;
}

if ($quoteId <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid quote_id']);
    exit;
}

// Verify quote exists.
$quote = get_quote($quoteId);
if ($quote === null) {
    http_response_code(404);
    echo json_encode(['error' => 'Quote not found']);
    exit;
}

$result = toggle_like($quoteId);
echo json_encode($result);
