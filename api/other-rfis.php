<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        if ($id) getOtherRfi($pdo, $id);
        else getAllOtherRfis($pdo);
        break;
    case 'POST':
        createOtherRfi($pdo);
        break;
    case 'PUT':
        if ($id) updateOtherRfi($pdo, $id);
        else sendError('ID is required for update');
        break;
    case 'DELETE':
        if ($id) deleteOtherRfi($pdo, $id);
        else sendError('ID is required for delete');
        break;
    default:
        sendError('Method not allowed', 405);
}

function getAllOtherRfis($pdo) {
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $sql = "SELECT * FROM other_rfis";
    $params = [];
    if ($search) {
        $sql .= " WHERE inspection_no LIKE :search OR location LIKE :search2 OR work_site LIKE :search3";
        $params[':search'] = "%$search%";
        $params[':search2'] = "%$search%";
        $params[':search3'] = "%$search%";
    }
    $sql .= " ORDER BY inspection_no DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    sendResponse($stmt->fetchAll());
}

function getOtherRfi($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM other_rfis WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $rfi = $stmt->fetch();
    if (!$rfi) sendError('RFI not found', 404);
    sendResponse($rfi);
}

function createOtherRfi($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) sendError('Invalid JSON data');
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->query("SELECT next_inspection_no FROM rfi_counter WHERE id = 1 FOR UPDATE");
        $counter = $stmt->fetch();
        $inspectionNo = $counter['next_inspection_no'];
        $pdo->exec("UPDATE rfi_counter SET next_inspection_no = next_inspection_no + 1 WHERE id = 1");

        $fields = ['ref_drawing','work_site','location','inspection_date','inspection_time','weather_condition',
            'inspection_item_1','inspection_item_2','inspection_item_3','inspection_item_4','inspection_item_5',
            'pre_inspection_name','pre_inspection_designation','pre_inspection_date',
            'received_by_name','received_by_designation','received_by_date',
            'comments','relevant_subclause',
            'client_rep_name','client_rep_designation','client_rep_date',
            'contractor_rep_name','contractor_rep_designation','contractor_rep_date','status'];
        $dateFields = ['inspection_date','pre_inspection_date','received_by_date','client_rep_date','contractor_rep_date'];

        $cols = ['inspection_no'];
        $vals = [':inspection_no'];
        $params = [':inspection_no' => $inspectionNo];
        foreach ($fields as $f) {
            $cols[] = $f;
            $vals[] = ":$f";
            $params[":$f"] = in_array($f, $dateFields) ? ($data[$f] ?? null) : ($data[$f] ?? '');
        }

        $stmt = $pdo->prepare("INSERT INTO other_rfis (" . implode(',', $cols) . ") VALUES (" . implode(',', $vals) . ")");
        $stmt->execute($params);
        $rfiId = $pdo->lastInsertId();

        $pdo->commit();
        sendResponse(['id' => $rfiId, 'inspection_no' => $inspectionNo, 'message' => 'Other RFI created'], 201);
    } catch (Exception $e) {
        $pdo->rollBack();
        sendError('Failed to create RFI: ' . $e->getMessage(), 500);
    }
}

function updateOtherRfi($pdo, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) sendError('Invalid JSON data');
    try {
        $fields = ['ref_drawing','work_site','location','inspection_date','inspection_time','weather_condition',
            'inspection_item_1','inspection_item_2','inspection_item_3','inspection_item_4','inspection_item_5',
            'pre_inspection_name','pre_inspection_designation','pre_inspection_date',
            'received_by_name','received_by_designation','received_by_date',
            'comments','relevant_subclause',
            'client_rep_name','client_rep_designation','client_rep_date',
            'contractor_rep_name','contractor_rep_designation','contractor_rep_date','status'];
        $dateFields = ['inspection_date','pre_inspection_date','received_by_date','client_rep_date','contractor_rep_date'];

        $sets = [];
        $params = [':id' => $id];
        foreach ($fields as $f) {
            $sets[] = "$f = :$f";
            $params[":$f"] = in_array($f, $dateFields) ? ($data[$f] ?? null) : ($data[$f] ?? '');
        }

        $stmt = $pdo->prepare("UPDATE other_rfis SET " . implode(', ', $sets) . " WHERE id = :id");
        $stmt->execute($params);
        sendResponse(['message' => 'Other RFI updated']);
    } catch (Exception $e) {
        sendError('Failed to update RFI: ' . $e->getMessage(), 500);
    }
}

function deleteOtherRfi($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM other_rfis WHERE id = :id");
    $stmt->execute([':id' => $id]);
    if ($stmt->rowCount() === 0) sendError('RFI not found', 404);
    sendResponse(['message' => 'Other RFI deleted']);
}
