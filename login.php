<?php
/**
 * Login page.
 */

require_once __DIR__ . '/includes/auth.php';

// Already logged in?
if (is_logged_in()) {
    header('Location: ' . BASE_URL . '/index.php');
    exit;
}

$errors = [];
$email  = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = (string) ($_POST['csrf_token'] ?? '');
    if (!verify_csrf($csrfToken)) {
        $errors[] = 'Invalid request. Please try again.';
    } else {
        $email    = trim((string) ($_POST['email'] ?? ''));
        $password = (string) ($_POST['password'] ?? '');

        if ($email === '' || $password === '') {
            $errors[] = 'Email and password are required.';
        } else {
            $stmt = db()->prepare('SELECT id, password_hash FROM users WHERE email = ?');
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                login_user((int) $user['id']);
                header('Location: ' . BASE_URL . '/index.php');
                exit;
            } else {
                $errors[] = 'Invalid email or password.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log in – <?= h(SITE_NAME) ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="auth-page">
    <div class="auth-card">
        <a href="index.php" class="logo logo-center"><?= h(SITE_NAME) ?></a>
        <h1 class="auth-title">Welcome back</h1>

        <?php if ($errors): ?>
            <ul class="form-errors" role="alert">
                <?php foreach ($errors as $err): ?>
                    <li><?= h($err) ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <form action="login.php" method="post" novalidate>
            <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">

            <div class="form-group">
                <label for="email">Email address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value="<?= h($email) ?>"
                    required
                    autocomplete="email"
                    class="form-input"
                >
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    class="form-input"
                >
            </div>

            <button type="submit" class="btn btn-primary btn-full">Log in</button>
        </form>

        <p class="auth-switch">
            Don't have an account? <a href="register.php">Sign up</a>
        </p>
    </div>
</body>
</html>
