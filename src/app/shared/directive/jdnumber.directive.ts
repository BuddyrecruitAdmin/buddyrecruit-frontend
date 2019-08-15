import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appNumberDirective]"
})
export class NumberDirective {
  // Allow decimal numbers and negative values
  // private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home

  constructor(private el: ElementRef) { }

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

    switch (this.el.nativeElement.name) {
      case "low":
        this.regex = new RegExp(/^\d{0,3}$/g);
        break;
      case "high":
        this.regex = new RegExp(/^\d{0,3}$/g);
        break;
      default:
        // this.regex = new RegExp(^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$);
        // this.regex = new RegExp(/^\s*(?=.*[0-9])\d{0,3}(?:\.\d{0,2})?\s*$/g);
        this.regex = new RegExp("^[0-9][0-9]?$|^100$");
        // this.regex = new RegExp("^([1-9]|[1-9][0-9]|100)*.[0-9]{2}$");

        // this.regex = new RegExp(/^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/);
        break;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    // event.preventDefault();
    // const pastedInput: string = event.clipboardData
    //   .getData('text/plain')
    //   .replace(/\D/g, ''); // get a digit-only string
    // document.execCommand('insertText', false, pastedInput);
  }
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    // event.preventDefault();
    // const textData = event.dataTransfer
    //   .getData('text').replace(/\D/g, '');
    // this.inputElement.focus();
    // document.execCommand('insertText', false, textData);
  }
}
