<?php
$jsonData = file_get_contents('veri.json');
$data = json_decode($jsonData, true);

header('Content-Type: application/json');
echo json_encode($data['features']);
?>