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
    // console.log("keydown");
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    // console.log("KeyDown");
    // console.log(this.el.nativeElement.name);
    switch (this.el.nativeElement.name) {
      case "capacity":
        this.regex = new RegExp(/^\d{0,3}$/g);
        break;
        case "age":
        this.regex = new RegExp(/^\d{0,2}$/g);
        break;
      case "gpa":
        // this.regex = new RegExp(/^[0-4][.][0-9][0-9]$/);
        this.regex = new RegExp(/^(([0-4]{1}\s)|([0-3]{1}\.\d{0,2}\s))|[4]\.[0]{0,2}\s/g);
        // this.regex = new RegExp(/^[0-4]\.\d\d$/);
        // this.regex = new RegExp(/^[0-4]\.\d{2}$/);
        break;
        case "number2digit":
        this.regex = new RegExp(/^\d{0,2}$/g);
        break;
      default:
        this.regex = new RegExp(/^\s*(?=.*[0-9])\d{0,3}(?:\.\d{0,2})?\s*$/g);
        break;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
