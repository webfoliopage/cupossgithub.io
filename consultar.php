<?php
$conexion = new mysqli("localhost", "root", "", "nombre_de_tu_base"); // cambia esto

if ($conexion->connect_error) {
  die("Conexión fallida: " . $conexion->connect_error);
}

$resultado = $conexion->query("SELECT * FROM pasantias");

$datos = [];

while ($fila = $resultado->fetch_assoc()) {
  $datos[] = $fila;
}

header('Content-Type: application/json');
echo json_encode($datos);

$conexion->close();
?>
