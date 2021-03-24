export interface Route {
  getDuration(): number;

  drawMap(element: HTMLElement): () => void;
}
