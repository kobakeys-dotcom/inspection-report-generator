<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        if ($id) getCfRfi($pdo, $id);
        else getAllCfRfis($pdo);
        break;
    case 'POST':
        createCfRfi($pdo);
        break;
    case 'PUT':
        if ($id) updateCfRfi($pdo, $id);
        else sendError('ID is required for update');
        break;
    case 'DELETE':
        if ($id) deleteCfRfi($pdo, $id);
        else sendError('ID is required for delete');
        break;
    default:
        sendError('Method not allowed', 405);
}

function getAllCfRfis($pdo) {
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $sql = "SELECT * FROM cf_rfis";
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

function getCfRfi($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM cf_rfis WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $rfi = $stmt->fetch();
    if (!$rfi) sendError('RFI not found', 404);
    $stmt = $pdo->prepare("SELECT * FROM cf_rfi_checklist_items WHERE rfi_id = :rfi_id ORDER BY item_order");
    $stmt->execute([':rfi_id' => $id]);
    $rfi['checklist_items'] = $stmt->fetchAll();
    sendResponse($rfi);
}

function createCfRfi($pdo) {
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
            'contractor_rep_name','contractor_rep_designation','contractor_rep_date',
            'completed_works_comments','page2_contractor_name','page2_contractor_designation',
            'page2_client_name','page2_client_designation','status'];

        $dateFields = ['inspection_date','pre_inspection_date','received_by_date','client_rep_date','contractor_rep_date'];

        $cols = ['inspection_no'];
        $vals = [':inspection_no'];
        $params = [':inspection_no' => $inspectionNo];
        foreach ($fields as $f) {
            $cols[] = $f;
            $vals[] = ":$f";
            $params[":$f"] = in_array($f, $dateFields) ? ($data[$f] ?? null) : ($data[$f] ?? '');
        }

        $stmt = $pdo->prepare("INSERT INTO cf_rfis (" . implode(',', $cols) . ") VALUES (" . implode(',', $vals) . ")");
        $stmt->execute($params);
        $rfiId = $pdo->lastInsertId();

        if (isset($data['checklist_items']) && is_array($data['checklist_items'])) {
            $stmt = $pdo->prepare("INSERT INTO cf_rfi_checklist_items (rfi_id, item_order, description, result, item_comments) VALUES (:rfi_id, :item_order, :description, :result, :item_comments)");
            foreach ($data['checklist_items'] as $item) {
                $stmt->execute([
                    ':rfi_id' => $rfiId,
                    ':item_order' => $item['item_order'],
                    ':description' => $item['description'],
                    ':result' => $item['result'] ?? '',
                    ':item_comments' => $item['comments'] ?? '',
                ]);
            }
        }

        $pdo->commit();
        sendResponse(['id' => $rfiId, 'inspection_no' => $inspectionNo, 'message' => 'Cladding Frame RFI created'], 201);
    } catch (Exception $e) {
        $pdo->rollBack();
        sendError('Failed to create RFI: ' . $e->getMessage(), 500);
    }
}

function updateCfRfi($pdo, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) sendError('Invalid JSON data');
    $pdo->beginTransaction();
    try {
        $fields = ['ref_drawing','work_site','location','inspection_date','inspection_time','weather_condition',
            'inspection_item_1','inspection_item_2','inspection_item_3','inspection_item_4','inspection_item_5',
            'pre_inspection_name','pre_inspection_designation','pre_inspection_date',
            'received_by_name','received_by_designation','received_by_date',
            'comments','relevant_subclause',
            'client_rep_name','client_rep_designation','client_rep_date',
            'contractor_rep_name','contractor_rep_designation','contractor_rep_date',
            'completed_works_comments','page2_contractor_name','page2_contractor_designation',
            'page2_client_name','page2_client_designation','status'];
        $dateFields = ['inspection_date','pre_inspection_date','received_by_date','client_rep_date','contractor_rep_date'];

        $sets = [];
        $params = [':id' => $id];
        foreach ($fields as $f) {
            $sets[] = "$f = :$f";
            $params[":$f"] = in_array($f, $dateFields) ? ($data[$f] ?? null) : ($data[$f] ?? '');
        }

        $stmt = $pdo->prepare("UPDATE cf_rfis SET " . implode(', ', $sets) . " WHERE id = :id");
        $stmt->execute($params);

        if (isset($data['checklist_items']) && is_array($data['checklist_items'])) {
            $pdo->prepare("DELETE FROM cf_rfi_checklist_items WHERE rfi_id = :rfi_id")->execute([':rfi_id' => $id]);
            $stmt = $pdo->prepare("INSERT INTO cf_rfi_checklist_items (rfi_id, item_order, description, result, item_comments) VALUES (:rfi_id, :item_order, :description, :result, :item_comments)");
            foreach ($data['checklist_items'] as $item) {
                $stmt->execute([
                    ':rfi_id' => $id,
                    ':item_order' => $item['item_order'],
                    ':description' => $item['description'],
                    ':result' => $item['result'] ?? '',
                    ':item_comments' => $item['comments'] ?? '',
                ]);
            }
        }

        $pdo->commit();
        sendResponse(['message' => 'Cladding Frame RFI updated']);
    } catch (Exception $e) {
        $pdo->rollBack();
        sendError('Failed to update RFI: ' . $e->getMessage(), 500);
    }
}

function deleteCfRfi($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM cf_rfis WHERE id = :id");
    $stmt->execute([':id' => $id]);
    if ($stmt->rowCount() === 0) sendError('RFI not found', 404);
    sendResponse(['message' => 'Cladding Frame RFI deleted']);
}
