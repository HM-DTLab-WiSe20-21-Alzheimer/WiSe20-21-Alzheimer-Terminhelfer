export enum TransportMode {
  CAR,
  BICYCLE,
  WALK,
  PUBLIC_TRANSPORT
}

export const getModeByString = (input: string): TransportMode => {
  switch (input) {
    case 'fahrrad':
      return TransportMode.BICYCLE;
    case 'oeffentliche verkehrsmittel':
      return TransportMode.PUBLIC_TRANSPORT;
    case 'auto':
      return TransportMode.CAR;
    case 'zu fuss':
    default:
      return TransportMode.WALK;
  }
};
