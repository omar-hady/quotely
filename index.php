<?php
/**
 * Home page – shows a random quote with like / share / next controls.
 */

require_once __DIR__ . '/includes/functions.php';

$user  = current_user();
$quote = get_random_quote();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= h(SITE_NAME) ?> – Discover Inspiring Quotes</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header class="site-header">
        <a href="index.php" class="logo"><?= h(SITE_NAME) ?></a>
        <nav class="nav">
            <?php if ($user): ?>
                <span class="nav-user">Hi, <?= h($user['username']) ?></span>
                <a href="add_quote.php" class="btn btn-secondary btn-sm">+ Add Quote</a>
                <form action="logout.php" method="post" class="inline-form">
                    <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">
                    <button type="submit" class="btn btn-outline btn-sm">Log out</button>
                </form>
            <?php else: ?>
                <a href="login.php" class="btn btn-outline btn-sm">Log in</a>
                <a href="register.php" class="btn btn-primary btn-sm">Sign up</a>
            <?php endif; ?>
        </nav>
    </header>

    <main class="main-content">
        <section class="quote-card" id="quote-card">
            <?php if ($quote): ?>
                <blockquote class="quote-text" id="quote-text">
                    "<?= h($quote['text']) ?>"
                </blockquote>
                <p class="quote-author" id="quote-author">— <?= h($quote['author']) ?></p>
                <p class="quote-submitted" id="quote-submitted">
                    Shared by <strong><?= h($quote['submitted_by']) ?></strong>
                </p>

                <div class="quote-actions">
                    <?php if ($user): ?>
                        <button
                            id="like-btn"
                            class="btn btn-like <?= $quote['user_liked'] ? 'liked' : '' ?>"
                            data-quote-id="<?= (int) $quote['id'] ?>"
                            data-csrf="<?= h(csrf_token()) ?>"
                            aria-label="Like this quote"
                            aria-pressed="<?= $quote['user_liked'] ? 'true' : 'false' ?>"
                        >
                            <span class="like-icon">♥</span>
                            <span class="like-count" id="like-count"><?= (int) $quote['like_count'] ?></span>
                        </button>
                    <?php else: ?>
                        <a href="login.php" class="btn btn-like" title="Log in to like">
                            <span class="like-icon">♥</span>
                            <span class="like-count"><?= (int) $quote['like_count'] ?></span>
                        </a>
                    <?php endif; ?>

                    <button
                        id="share-btn"
                        class="btn btn-share"
                        data-quote="<?= h('"' . $quote['text'] . '" — ' . $quote['author']) ?>"
                        aria-label="Share this quote"
                    >
                        <span>Share</span>
                    </button>

                    <button id="next-btn" class="btn btn-next" aria-label="Next quote">
                        Next Quote →
                    </button>
                </div>
            <?php else: ?>
                <p class="empty-state">No quotes yet. <a href="add_quote.php">Be the first to add one!</a></p>
            <?php endif; ?>
        </section>

        <div id="share-toast" class="toast" role="status" aria-live="polite" hidden>
            Copied to clipboard!
        </div>
    </main>

    <footer class="site-footer">
        <p>&copy; <?= date('Y') ?> <?= h(SITE_NAME) ?>. Made with ♥</p>
    </footer>

    <script>
        const CSRF_TOKEN   = <?= json_encode(csrf_token()) ?>;
        const IS_LOGGED_IN = <?= json_encode((bool) $user) ?>;
    </script>
    <script src="assets/js/app.js"></script>
</body>
</html>
