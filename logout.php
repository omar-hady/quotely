<?php
/**
 * Logout handler.
 */

require_once __DIR__ . '/includes/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = (string) ($_POST['csrf_token'] ?? '');
    if (is_logged_in() && verify_csrf($token)) {
        logout_user();
    }
}

header('Location: ' . BASE_URL . '/login.php');
exit;
