interface JQuery {
  ripples(options?: {
    resolution?: number;
    dropRadius?: number;
    perturbance?: number;
    interactive?: boolean;
    crossOrigin?: string | null;
  }): JQuery;

  ripples(method: 'destroy' | 'hide' | 'show' | 'pause' | 'play'): JQuery;
}
