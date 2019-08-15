import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appNumberDirective]"
})
export class NumberDirective {
  // Allow decimal numbers and negative values
  // private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home

  constructor(private el: ElementRef) {}

  private specialKeys: Array<string> = [
    "Backspace",
    "Delete",
    "Tab",
    "End",
    "Home",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown"
  ];

  private regex: RegExp;

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    // console.log("KeyDown");
    // console.log(this.el.nativeElement.name);
    switch (this.el.nativeElement.name) {
      case "capacity":
        this.regex = new RegExp("^[0-9][0-9]?$|^100$");
        break;
      default:
        this.regex = new RegExp("^[0-9][0-9]?$|^100$");
        break;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
