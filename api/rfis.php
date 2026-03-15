<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['action']) ? $_GET['action'] : '';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        if ($id) {
            getRfi($pdo, $id);
        } else {
            getAllRfis($pdo);
        }
        break;
    case 'POST':
        createRfi($pdo);
        break;
    case 'PUT':
        if ($id) {
            updateRfi($pdo, $id);
        } else {
            sendError('ID is required for update');
        }
        break;
    case 'DELETE':
        if ($id) {
            deleteRfi($pdo, $id);
        } else {
            sendError('ID is required for delete');
        }
        break;
    default:
        sendError('Method not allowed', 405);
}

function getAllRfis($pdo) {
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    $sql = "SELECT * FROM rfis";
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
    $rfis = $stmt->fetchAll();
    
    sendResponse($rfis);
}

function getRfi($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM rfis WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $rfi = $stmt->fetch();
    
    if (!$rfi) {
        sendError('RFI not found', 404);
    }
    
    // Get checklist items
    $stmt = $pdo->prepare("SELECT * FROM rfi_checklist_items WHERE rfi_id = :rfi_id ORDER BY item_order");
    $stmt->execute([':rfi_id' => $id]);
    $rfi['checklist_items'] = $stmt->fetchAll();
    
    sendResponse($rfi);
}

function createRfi($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        sendError('Invalid JSON data');
    }
    
    $pdo->beginTransaction();
    
    try {
        // Get next inspection number
        $stmt = $pdo->query("SELECT next_inspection_no FROM rfi_counter WHERE id = 1 FOR UPDATE");
        $counter = $stmt->fetch();
        $inspectionNo = $counter['next_inspection_no'];
        
        // Increment counter
        $pdo->exec("UPDATE rfi_counter SET next_inspection_no = next_inspection_no + 1 WHERE id = 1");
        
        $stmt = $pdo->prepare("INSERT INTO rfis (
            inspection_no, ref_drawing, work_site, location, inspection_date, inspection_time,
            weather_condition, inspection_item_1, inspection_item_2, inspection_item_3,
            inspection_item_4, inspection_item_5, pre_inspection_name, pre_inspection_designation,
            pre_inspection_date, received_by_name, received_by_designation, received_by_date,
            comments, relevant_subclause, client_rep_name, client_rep_designation, client_rep_date,
            contractor_rep_name, contractor_rep_designation, contractor_rep_date,
            completed_works_comments, page2_contractor_name, page2_contractor_designation,
            page2_client_name, page2_client_designation, status
        ) VALUES (
            :inspection_no, :ref_drawing, :work_site, :location, :inspection_date, :inspection_time,
            :weather_condition, :inspection_item_1, :inspection_item_2, :inspection_item_3,
            :inspection_item_4, :inspection_item_5, :pre_inspection_name, :pre_inspection_designation,
            :pre_inspection_date, :received_by_name, :received_by_designation, :received_by_date,
            :comments, :relevant_subclause, :client_rep_name, :client_rep_designation, :client_rep_date,
            :contractor_rep_name, :contractor_rep_designation, :contractor_rep_date,
            :completed_works_comments, :page2_contractor_name, :page2_contractor_designation,
            :page2_client_name, :page2_client_designation, :status
        )");
        
        $stmt->execute([
            ':inspection_no' => $inspectionNo,
            ':ref_drawing' => $data['ref_drawing'] ?? '',
            ':work_site' => $data['work_site'] ?? '',
            ':location' => $data['location'] ?? '',
            ':inspection_date' => $data['inspection_date'] ?? null,
            ':inspection_time' => $data['inspection_time'] ?? '',
            ':weather_condition' => $data['weather_condition'] ?? '',
            ':inspection_item_1' => $data['inspection_item_1'] ?? '',
            ':inspection_item_2' => $data['inspection_item_2'] ?? '',
            ':inspection_item_3' => $data['inspection_item_3'] ?? '',
            ':inspection_item_4' => $data['inspection_item_4'] ?? '',
            ':inspection_item_5' => $data['inspection_item_5'] ?? '',
            ':pre_inspection_name' => $data['pre_inspection_name'] ?? '',
            ':pre_inspection_designation' => $data['pre_inspection_designation'] ?? '',
            ':pre_inspection_date' => $data['pre_inspection_date'] ?? null,
            ':received_by_name' => $data['received_by_name'] ?? '',
            ':received_by_designation' => $data['received_by_designation'] ?? '',
            ':received_by_date' => $data['received_by_date'] ?? null,
            ':comments' => $data['comments'] ?? '',
            ':relevant_subclause' => $data['relevant_subclause'] ?? '',
            ':client_rep_name' => $data['client_rep_name'] ?? '',
            ':client_rep_designation' => $data['client_rep_designation'] ?? '',
            ':client_rep_date' => $data['client_rep_date'] ?? null,
            ':contractor_rep_name' => $data['contractor_rep_name'] ?? '',
            ':contractor_rep_designation' => $data['contractor_rep_designation'] ?? '',
            ':contractor_rep_date' => $data['contractor_rep_date'] ?? null,
            ':completed_works_comments' => $data['completed_works_comments'] ?? '',
            ':page2_contractor_name' => $data['page2_contractor_name'] ?? '',
            ':page2_contractor_designation' => $data['page2_contractor_designation'] ?? '',
            ':page2_client_name' => $data['page2_client_name'] ?? '',
            ':page2_client_designation' => $data['page2_client_designation'] ?? '',
            ':status' => $data['status'] ?? 'draft',
        ]);
        
        $rfiId = $pdo->lastInsertId();
        
        // Insert checklist items
        if (isset($data['checklist_items']) && is_array($data['checklist_items'])) {
            $stmt = $pdo->prepare("INSERT INTO rfi_checklist_items (rfi_id, item_order, description, result, item_comments) VALUES (:rfi_id, :item_order, :description, :result, :item_comments)");
            
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
        
        sendResponse(['id' => $rfiId, 'inspection_no' => $inspectionNo, 'message' => 'RFI created successfully'], 201);
    } catch (Exception $e) {
        $pdo->rollBack();
        sendError('Failed to create RFI: ' . $e->getMessage(), 500);
    }
}

function updateRfi($pdo, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        sendError('Invalid JSON data');
    }
    
    $pdo->beginTransaction();
    
    try {
        $stmt = $pdo->prepare("UPDATE rfis SET
            ref_drawing = :ref_drawing, work_site = :work_site, location = :location,
            inspection_date = :inspection_date, inspection_time = :inspection_time,
            weather_condition = :weather_condition, inspection_item_1 = :inspection_item_1,
            inspection_item_2 = :inspection_item_2, inspection_item_3 = :inspection_item_3,
            inspection_item_4 = :inspection_item_4, inspection_item_5 = :inspection_item_5,
            pre_inspection_name = :pre_inspection_name, pre_inspection_designation = :pre_inspection_designation,
            pre_inspection_date = :pre_inspection_date, received_by_name = :received_by_name,
            received_by_designation = :received_by_designation, received_by_date = :received_by_date,
            comments = :comments, relevant_subclause = :relevant_subclause,
            client_rep_name = :client_rep_name, client_rep_designation = :client_rep_designation,
            client_rep_date = :client_rep_date, contractor_rep_name = :contractor_rep_name,
            contractor_rep_designation = :contractor_rep_designation, contractor_rep_date = :contractor_rep_date,
            completed_works_comments = :completed_works_comments,
            page2_contractor_name = :page2_contractor_name, page2_contractor_designation = :page2_contractor_designation,
            page2_client_name = :page2_client_name, page2_client_designation = :page2_client_designation,
            status = :status
            WHERE id = :id");
        
        $stmt->execute([
            ':id' => $id,
            ':ref_drawing' => $data['ref_drawing'] ?? '',
            ':work_site' => $data['work_site'] ?? '',
            ':location' => $data['location'] ?? '',
            ':inspection_date' => $data['inspection_date'] ?? null,
            ':inspection_time' => $data['inspection_time'] ?? '',
            ':weather_condition' => $data['weather_condition'] ?? '',
            ':inspection_item_1' => $data['inspection_item_1'] ?? '',
            ':inspection_item_2' => $data['inspection_item_2'] ?? '',
            ':inspection_item_3' => $data['inspection_item_3'] ?? '',
            ':inspection_item_4' => $data['inspection_item_4'] ?? '',
            ':inspection_item_5' => $data['inspection_item_5'] ?? '',
            ':pre_inspection_name' => $data['pre_inspection_name'] ?? '',
            ':pre_inspection_designation' => $data['pre_inspection_designation'] ?? '',
            ':pre_inspection_date' => $data['pre_inspection_date'] ?? null,
            ':received_by_name' => $data['received_by_name'] ?? '',
            ':received_by_designation' => $data['received_by_designation'] ?? '',
            ':received_by_date' => $data['received_by_date'] ?? null,
            ':comments' => $data['comments'] ?? '',
            ':relevant_subclause' => $data['relevant_subclause'] ?? '',
            ':client_rep_name' => $data['client_rep_name'] ?? '',
            ':client_rep_designation' => $data['client_rep_designation'] ?? '',
            ':client_rep_date' => $data['client_rep_date'] ?? null,
            ':contractor_rep_name' => $data['contractor_rep_name'] ?? '',
            ':contractor_rep_designation' => $data['contractor_rep_designation'] ?? '',
            ':contractor_rep_date' => $data['contractor_rep_date'] ?? null,
            ':completed_works_comments' => $data['completed_works_comments'] ?? '',
            ':page2_contractor_name' => $data['page2_contractor_name'] ?? '',
            ':page2_contractor_designation' => $data['page2_contractor_designation'] ?? '',
            ':page2_client_name' => $data['page2_client_name'] ?? '',
            ':page2_client_designation' => $data['page2_client_designation'] ?? '',
            ':status' => $data['status'] ?? 'draft',
        ]);
        
        // Update checklist items
        if (isset($data['checklist_items']) && is_array($data['checklist_items'])) {
            $pdo->prepare("DELETE FROM rfi_checklist_items WHERE rfi_id = :rfi_id")->execute([':rfi_id' => $id]);
            
            $stmt = $pdo->prepare("INSERT INTO rfi_checklist_items (rfi_id, item_order, description, result, item_comments) VALUES (:rfi_id, :item_order, :description, :result, :item_comments)");
            
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
        sendResponse(['message' => 'RFI updated successfully']);
    } catch (Exception $e) {
        $pdo->rollBack();
        sendError('Failed to update RFI: ' . $e->getMessage(), 500);
    }
}

function deleteRfi($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM rfis WHERE id = :id");
    $stmt->execute([':id' => $id]);
    
    if ($stmt->rowCount() === 0) {
        sendError('RFI not found', 404);
    }
    
    sendResponse(['message' => 'RFI deleted successfully']);
}
