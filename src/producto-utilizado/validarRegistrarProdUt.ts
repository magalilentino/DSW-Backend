export function validarRegistrarProdUt(idAtSer: any, prodMars: any) {

  if (!idAtSer) {
    return "ID de Servicio-Atención (idAtSer) es requerido.";
  }

  const idAtSerInt = parseInt(idAtSer, 10);

  if (isNaN(idAtSerInt) || idAtSerInt <= 0) {
    return "ID de Servicio-Atención no válido.";
  }

  if (!Array.isArray(prodMars)) {
    return "El formato de la lista de productos es incorrecto.";
  }

  return null;
}