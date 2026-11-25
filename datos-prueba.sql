SET NAMES utf8mb4;

INSERT INTO persona (id_persona, dni, clave, nombre, apellido, telefono, email, type) VALUES
(1, '30111222', '$2b$10$lbprK7GSgkI.Yfcm8EPV7.TPGLkeuZqPmZNv5RAxbqDwxfSfZV5DG', 'Lucía', 'Fernández', '3415550001', 'peluquero@peluqueria.com', 'peluquero'),
(2, '40333444', '$2b$10$t6/gmyFnfgJcwfCEP70zwuYRbbfbepw1e9Ll.pGHbhpxMw1SfpsA6', 'Martín', 'Gómez', '3415550002', 'cliente@peluqueria.com', 'cliente');

INSERT INTO categoria (id_categoria, nombre_categoria) VALUES
(1, 'Tinturas'),
(2, 'Oxidantes'),
(3, 'Shampoo y acondicionador'),
(4, 'Tratamientos');

INSERT INTO marca (id_marca, nombre) VALUES
(1, 'L''Oréal'),
(2, 'Wella'),
(3, 'Schwarzkopf'),
(4, 'Revlon');

INSERT INTO producto (id_producto, descripcion, activo, categoria) VALUES
(1, 'Tintura 7.1 rubio ceniza', 1, 1),
(2, 'Tintura 5.0 castaño claro', 1, 1),
(3, 'Tintura 9.3 rubio muy claro dorado', 1, 1),
(4, 'Oxidante 20 volúmenes', 1, 2),
(5, 'Oxidante 30 volúmenes', 1, 2),
(6, 'Shampoo neutro', 1, 3),
(7, 'Acondicionador nutritivo', 1, 3),
(8, 'Máscara hidratante', 1, 4);

INSERT INTO prod_mar (id_pm, activo, producto, marca) VALUES
(1, 1, 1, 1),
(2, 1, 1, 2),
(3, 1, 2, 1),
(4, 1, 3, 2),
(5, 1, 4, 1),
(6, 1, 4, 2),
(7, 1, 5, 3),
(8, 1, 6, 4),
(9, 1, 7, 4),
(10, 1, 8, 3);

INSERT INTO tono (id_tono, nombre, activo) VALUES
(1, 'Rubio ceniza', 1),
(2, 'Castaño claro', 1),
(3, 'Rubio dorado', 1);

INSERT INTO formula (id_formula, cantidad, activo, prodMar, tono) VALUES
(1, 50, 1, 1, 1),
(2, 75, 1, 5, 1),
(3, 50, 1, 3, 2),
(4, 50, 1, 5, 2),
(5, 60, 1, 4, 3),
(6, 90, 1, 6, 3);

INSERT INTO servicio (cod_servicio, nombre_servicio, descripcion, cant_turnos, precio, activo, requiere_tono) VALUES
(1, 'Corte de cabello', 'Corte clásico para hombre o mujer', 1, 8000, 1, 0),
(2, 'Peinado', 'Peinado para eventos o fiestas', 1, 10000, 1, 0),
(3, 'Tintura completa', 'Aplicación de tintura en todo el cabello', 2, 25000, 1, 1),
(4, 'Mechas balayage', 'Técnica de aclarado a mano alzada', 4, 45000, 1, 1),
(5, 'Tratamiento capilar', 'Hidratación profunda y nutrición del cabello', 2, 15000, 1, 0),
(6, 'Barba', 'Perfilado y arreglo de barba', 1, 6000, 1, 0);

INSERT INTO descuento (id_descuento, porcentaje, cant_atencion_necesaria, estado) VALUES
(1, 10, 2, 1),
(2, 20, 5, 1);

INSERT INTO atencion (id_atencion, cliente, peluquero, fecha, hora_inicio, hora_fin, descripcion, estado, porcentaje_descuento) VALUES
(1, 2, 1, '2026-10-15 00:00:00', '2026-10-15 10:00:00', '2026-10-15 10:45:00', 'Corte y lavado', 'finalizado', NULL),
(2, 2, 1, '2026-10-25 00:00:00', '2026-10-25 11:30:00', '2026-10-25 12:15:00', '', 'cancelado', NULL),
(3, 2, 1, '2026-11-05 00:00:00', '2026-11-05 09:00:00', '2026-11-05 10:30:00', 'Tintura castaño claro', 'finalizado', NULL);

INSERT INTO at_ser (id_at_ser, atencion_id, servicio_id, tono_id, modificado) VALUES
(1, 1, 1, NULL, 0),
(2, 2, 2, NULL, 0),
(3, 3, 3, NULL, 0);
