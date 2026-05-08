export function validarCrearServicio(input: any) {
  if (
    !input?.nombreServicio ||
    !input?.precio ||
    input.precio <= 0 ||
    !input?.cantTurnos ||
    input.cantTurnos <= 0
  ) {
    return {
      valido: false as const,
      status: 400,
      message: "El nombre, el precio y la duración (cantTurnos) son obligatorios y deben ser valores válidos."
    };
  }
  return { valido: true as const };
}

export function validarNombreDuplicado(nombreInput: string, servicioExistente: any) {
  if (servicioExistente) {
    return {
      valido: false as const,
      status: 409,
      message: "Ya existe un servicio con ese nombre."
    };
  }
  return { valido: true as const };
}