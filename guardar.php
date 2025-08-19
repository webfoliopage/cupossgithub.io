<?php
$conexion = new mysqli("localhost", "root", "", "nombre_de_tu_base"); // cambia esto

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$stmt = $conexion->prepare("INSERT INTO pasantias (
  institucion_solicitante, horas, semestre, fecha_inicio, fecha_final,
  numero_estudiantes, institucion_asignada, servicio, tutor_academico, estado, observaciones
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param("sssssssssss",
  $_POST["institucion_solicitante"],
  $_POST["horas"],
  $_POST["semestre"],
  $_POST["fecha_inicio"],
  $_POST["fecha_final"],
  $_POST["numero_estudiantes"],
  $_POST["institucion_asignada"],
  $_POST["servicio"],
  $_POST["tutor_academico"],
  $_POST["estado"],
  $_POST["observaciones"]
);

if ($stmt->execute()) {
  echo "✅ Registro guardado correctamente.";
} else {
  echo "❌ Error al guardar: " . $stmt->error;
}

$stmt->close();
$conexion->close();
?>
