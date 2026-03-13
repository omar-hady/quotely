<?php
/**
 * Registration page.
 */

require_once __DIR__ . '/includes/auth.php';

// Already logged in?
if (is_logged_in()) {
    header('Location: ' . BASE_URL . '/index.php');
    exit;
}

$errors   = [];
$username = '';
$email    = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = (string) ($_POST['csrf_token'] ?? '');
    if (!verify_csrf($csrfToken)) {
        $errors[] = 'Invalid request. Please try again.';
    } else {
        $username = trim((string) ($_POST['username'] ?? ''));
        $email    = trim((string) ($_POST['email'] ?? ''));
        $password = (string) ($_POST['password'] ?? '');
        $confirm  = (string) ($_POST['password_confirm'] ?? '');

        // Validate.
        if ($username === '') {
            $errors[] = 'Username is required.';
        } elseif (!preg_match('/^[A-Za-z0-9_]{3,50}$/', $username)) {
            $errors[] = 'Username must be 3–50 characters and contain only letters, numbers, or underscores.';
        }

        if ($email === '') {
            $errors[] = 'Email address is required.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address.';
        }

        if (mb_strlen($password) < 8) {
            $errors[] = 'Password must be at least 8 characters.';
        } elseif ($password !== $confirm) {
            $errors[] = 'Passwords do not match.';
        }

        if (!$errors) {
            $pdo = db();

            // Check uniqueness.
            $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
            $stmt->execute([$username, $email]);
            if ($stmt->fetch()) {
                $errors[] = 'Username or email is already taken.';
            } else {
                $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
                $ins  = $pdo->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
                $ins->execute([$username, $email, $hash]);
                $newId = (int) $pdo->lastInsertId();
                login_user($newId);
                header('Location: ' . BASE_URL . '/index.php');
                exit;
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
    <title>Sign up – <?= h(SITE_NAME) ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="auth-page">
    <div class="auth-card">
        <a href="index.php" class="logo logo-center"><?= h(SITE_NAME) ?></a>
        <h1 class="auth-title">Create your account</h1>

        <?php if ($errors): ?>
            <ul class="form-errors" role="alert">
                <?php foreach ($errors as $err): ?>
                    <li><?= h($err) ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <form action="register.php" method="post" novalidate>
            <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">

            <div class="form-group">
                <label for="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value="<?= h($username) ?>"
                    required
                    autocomplete="username"
                    class="form-input"
                    minlength="3"
                    maxlength="50"
                    pattern="[A-Za-z0-9_]+"
                >
            </div>

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
                    autocomplete="new-password"
                    class="form-input"
                    minlength="8"
                >
            </div>

            <div class="form-group">
                <label for="password_confirm">Confirm password</label>
                <input
                    type="password"
                    id="password_confirm"
                    name="password_confirm"
                    required
                    autocomplete="new-password"
                    class="form-input"
                    minlength="8"
                >
            </div>

            <button type="submit" class="btn btn-primary btn-full">Create account</button>
        </form>

        <p class="auth-switch">
            Already have an account? <a href="login.php">Log in</a>
        </p>
    </div>
</body>
</html>
