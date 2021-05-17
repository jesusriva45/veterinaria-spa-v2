import {
  animate,
  AUTO_STYLE,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

export function Acordion(name: string) {
  return trigger(name, [
    state("false", style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
    state("true", style({ height: "0", visibility: "hidden" })),
    transition("false => true", animate("500ms ease-in")),
    transition("true => false", animate("500ms ease-out")),
  ]);
}
