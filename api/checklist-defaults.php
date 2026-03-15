<?php
require_once 'config.php';

$stmt = $pdo->query("SELECT * FROM default_checklist_items ORDER BY item_order");
$items = $stmt->fetchAll();

sendResponse($items);
