export function isServiceWithinImmigrationProgram(
  servicesResponse,
  serviceId: number
): boolean {
  const service = servicesResponse.services.find((s) => s.id === serviceId);
  if (service) {
    const program = servicesResponse.programs.find(
      (program) => program.id === service.programId
    );
    return program.programName.toLowerCase().includes("immigration");
  } else {
    throw Error(`Invalid service id ${serviceId}`);
  }
}
