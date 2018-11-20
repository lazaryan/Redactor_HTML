<?php
# файл перезапись файла

$sha256 = hash('sha256', $_POST['key']);

if ($sha256 == 'f5b1ec11986c6342f899e2001d8bdb3a9ab8820226c1d8e21a5742a2ff17bf2b') {
	$file = $_POST['path'];

	$text_body = $_POST['html'];
	$text = '<!DOCTYPE html>';
	$text .= '<html lang="en">';
	$text .= $text_body;
	$text .= '</html>';

	file_put_contents($file, $text);

	echo 'OK';
} else {
	echo 'No OK!'
}
?>
