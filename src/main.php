<?php
# файл перезапись файла
$file = $_POST['path'];

$text_body = $_POST['html'];
$text = '<!DOCTYPE html>';
$text .= '<html lang="en">';
$text .= $text_body;
$text .= '</html>';

file_put_contents($file, $text);

echo 'OK';

?>
