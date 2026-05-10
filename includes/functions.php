<?php
/**
 * Quote-related helper functions.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

/**
 * Fetch a single random quote with its like count and whether the
 * current user has liked it.
 */
function get_random_quote(): ?array
{
    $userId = is_logged_in() ? current_user()['id'] : null;

    $sql = '
        SELECT
            q.id,
            q.text,
            q.author,
            u.username AS submitted_by,
            COUNT(DISTINCT l.id) AS like_count,
            MAX(CASE WHEN l.user_id = :uid THEN 1 ELSE 0 END) AS user_liked
        FROM quotes q
        JOIN users u ON u.id = q.user_id
        LEFT JOIN likes l ON l.quote_id = q.id
        GROUP BY q.id, q.text, q.author, u.username
        ORDER BY RAND()
        LIMIT 1
    ';
    $stmt = db()->prepare($sql);
    $stmt->execute([':uid' => $userId]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * Fetch a specific quote by ID.
 */
function get_quote(int $id): ?array
{
    $userId = is_logged_in() ? current_user()['id'] : null;

    $sql = '
        SELECT
            q.id,
            q.text,
            q.author,
            u.username AS submitted_by,
            COUNT(DISTINCT l.id) AS like_count,
            MAX(CASE WHEN l.user_id = :uid THEN 1 ELSE 0 END) AS user_liked
        FROM quotes q
        JOIN users u ON u.id = q.user_id
        LEFT JOIN likes l ON l.quote_id = q.id
        WHERE q.id = :id
        GROUP BY q.id, q.text, q.author, u.username
    ';
    $stmt = db()->prepare($sql);
    $stmt->execute([':uid' => $userId, ':id' => $id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * Toggle a like for the current logged-in user on a quote.
 * Returns ['liked' => bool, 'like_count' => int].
 */
function toggle_like(int $quoteId): array
{
    $pdo    = db();
    $userId = current_user()['id'];

    // Check existing like.
    $check = $pdo->prepare('SELECT id FROM likes WHERE user_id = ? AND quote_id = ?');
    $check->execute([$userId, $quoteId]);
    $existing = $check->fetch();

    if ($existing) {
        $pdo->prepare('DELETE FROM likes WHERE user_id = ? AND quote_id = ?')
            ->execute([$userId, $quoteId]);
        $liked = false;
    } else {
        $pdo->prepare('INSERT INTO likes (user_id, quote_id) VALUES (?, ?)')
            ->execute([$userId, $quoteId]);
        $liked = true;
    }

    $count = (int) $pdo->prepare('SELECT COUNT(*) FROM likes WHERE quote_id = ?')
                       ->execute([$quoteId]) ?: 0;
    // Re-fetch count properly.
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM likes WHERE quote_id = ?');
    $stmt->execute([$quoteId]);
    $count = (int) $stmt->fetchColumn();

    return ['liked' => $liked, 'like_count' => $count];
}

/**
 * Add a new quote.
 * Returns the new quote's ID.
 */
function add_quote(string $text, string $author, int $userId): int
{
    $stmt = db()->prepare(
        'INSERT INTO quotes (text, author, user_id) VALUES (?, ?, ?)'
    );
    $stmt->execute([trim($text), trim($author), $userId]);
    return (int) db()->lastInsertId();
}

/**
 * Sanitize a string for HTML output.
 */
function h(string $str): string
{
    return htmlspecialchars($str, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
