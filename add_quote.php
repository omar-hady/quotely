<?php
/**
 * Add a new quote page.
 */

require_once __DIR__ . '/includes/functions.php';
require_login();

$user   = current_user();
$errors = [];
$text   = '';
$author = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = (string) ($_POST['csrf_token'] ?? '');
    if (!verify_csrf($csrfToken)) {
        $errors[] = 'Invalid request. Please try again.';
    } else {
        $text   = trim((string) ($_POST['text'] ?? ''));
        $author = trim((string) ($_POST['author'] ?? '')) ?: 'Unknown';

        if ($text === '') {
            $errors[] = 'Quote text is required.';
        } elseif (mb_strlen($text) > 1000) {
            $errors[] = 'Quote text must not exceed 1000 characters.';
        }

        if (mb_strlen($author) > 150) {
            $errors[] = 'Author name must not exceed 150 characters.';
        }

        if (!$errors) {
            add_quote($text, $author, (int) $user['id']);
            header('Location: ' . BASE_URL . '/index.php?added=1');
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add a Quote – <?= h(SITE_NAME) ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="auth-page">
    <div class="auth-card add-quote-card">
        <a href="index.php" class="logo logo-center"><?= h(SITE_NAME) ?></a>
        <h1 class="auth-title">Add a Quote</h1>

        <?php if ($errors): ?>
            <ul class="form-errors" role="alert">
                <?php foreach ($errors as $err): ?>
                    <li><?= h($err) ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <form action="add_quote.php" method="post" novalidate>
            <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">

            <div class="form-group">
                <label for="text">Quote <span class="required">*</span></label>
                <textarea
                    id="text"
                    name="text"
                    required
                    class="form-input form-textarea"
                    maxlength="1000"
                    rows="4"
                    placeholder="Enter the quote text…"
                ><?= h($text) ?></textarea>
                <small class="char-hint">Max 1000 characters</small>
            </div>

            <div class="form-group">
                <label for="author">Author</label>
                <input
                    type="text"
                    id="author"
                    name="author"
                    value="<?= h($author) ?>"
                    class="form-input"
                    maxlength="150"
                    placeholder="Who said it? (leave blank for Unknown)"
                >
            </div>

            <div class="form-actions">
                <a href="index.php" class="btn btn-outline">Cancel</a>
                <button type="submit" class="btn btn-primary">Submit Quote</button>
            </div>
        </form>
    </div>
</body>
</html>
