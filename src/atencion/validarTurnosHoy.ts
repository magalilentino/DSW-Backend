export function validarUsuarioLogueado(user?: { id: number; type: string; nombre: string }) {
  if (!user?.id) {
    return { valido: false as const, status: 401, message: "No se encontró el peluquero logueado" };
  }
  return { valido: true as const };
}