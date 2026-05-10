<?php
/**
 * Database configuration.
 * Override values using environment variables for production deployments.
 */

define('DB_HOST',   getenv('DB_HOST')   ?: 'localhost');
define('DB_PORT',   (int)(getenv('DB_PORT') ?: 3306));
define('DB_NAME',   getenv('DB_NAME')   ?: 'quotely');
define('DB_USER',   getenv('DB_USER')   ?: 'root');
define('DB_PASS',   getenv('DB_PASS')   ?: '');
define('DB_CHARSET','utf8mb4');

define('SITE_NAME', 'Quotely');
define('BASE_URL',  rtrim(getenv('BASE_URL') ?: '', '/'));

/**
 * Returns a singleton PDO connection.
 */
function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
        );
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    }
    return $pdo;
}
