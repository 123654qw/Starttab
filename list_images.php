<?php
// 设置响应头为JSON
header('Content-Type: application/json');

// 直接列出已知的图片文件
$images = [
    'img/001.jpg',
    'img/002.jpg',
    'img/003.jpg',
    'img/004.jpg',
    'img/006.jpg',
    'img/007.jpg',
    'img/008.jpg'
];

// 返回JSON格式的图片列表
echo json_encode($images);
?>
