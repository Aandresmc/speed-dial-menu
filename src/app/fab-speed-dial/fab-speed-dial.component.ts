import {
  Component,
  Input,
  ContentChildren,
  ContentChild,
  ElementRef,
  HostListener,
  AfterContentInit,
  Directive,
  QueryList,
  HostBinding
} from "@angular/core";

export enum PositionsActionsFab {
  Top,
  Bottom,
  Left,
  Right
}

@Directive({
  selector: "[appFabButton]"
})
export class FabButtonDirective {
  @HostBinding("class.fab-button") class = "button";
}

@Directive({
  selector: "[appFabToggle]"
})
export class FabToggleDirective {
  @HostBinding("class.fab-toggle") class = "true";
}

@Component({
  selector: "app-fab-speed-dial",
  template: `
    <div class="fab-menu">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .fab-menu {
        position: relative;
        display: inline-block;
      }

      .fab-menu ::ng-deep .fab-button {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transition-timing-function: ease-out;
        transition-property: transform;
      }

      .fab-menu ::ng-deep .fab-toggle {
        z-index: 2;
      }
    `
  ]
})
export class FabSpeedDialComponent implements AfterContentInit {
  private active!: boolean;

  @Input()
  public direction: PositionsActionsFab = PositionsActionsFab.Right;

  @ContentChild(FabToggleDirective, { read: ElementRef })
  private readonly toggle!: ElementRef;

  @ContentChildren(FabButtonDirective, { read: ElementRef })
  private readonly buttons!: QueryList<ElementRef>;

  private btnArray: ElementRef[] = [];

  constructor(private readonly element: ElementRef) {}

  public ngAfterContentInit() {
    this.btnArray = this.buttons.toArray();

    this.undoTranslation();

    this.toggle.nativeElement.onclick = () => {
      this.active = !this.active;
      this.updateButtons();
    };
  }

  private undoTranslation() {
    const tWidth = this.toggle.nativeElement.offsetWidth;
    const tHeight = this.toggle.nativeElement.offsetHeight;

    for (const button of this.btnArray) {
      const bHeight = button.nativeElement.offsetHeight;
      const bWidth = button.nativeElement.offsetWidth;
      var style = button.nativeElement.style;

      style["visibility"] = "hidden";
      style["transition-duration"] = "";
      style["transform"] = `translate3d(${(tWidth - bWidth) / 2}px, ${
        (tHeight - bHeight) / 2
      }px ,0)`;
    }
  }

  private getTranslate(
    xTrans: number,
    yTrans: number,
    tWidth: number,
    tHeight: number,
    bWidth: number,
    bHeight: number
  ) {
    let translate = "";

    switch (this.direction) {
      case PositionsActionsFab.Left:
        translate = `translate3d(${-xTrans}px, ${
          (tHeight - bHeight) / 2
        }px, 0)`;
        break;

      case PositionsActionsFab.Right:
        translate = `translate3d(${xTrans}px, ${(tHeight - bHeight) / 2}px, 0)`;
        break;

      case PositionsActionsFab.Top:
        translate = `translate3d(${(tWidth - bWidth) / 2}px, ${-yTrans}px,0)`;
        break;

      case PositionsActionsFab.Bottom:
        translate = `translate3d(${(tWidth - bWidth) / 2}px, ${yTrans}px, 0)`;
        break;

      default:
        console.error(`Unsupported direction for Fab; ${this.direction}`);
        break;
    }

    return translate;
  }

  private doTranslation() {
    const tWidth = this.toggle.nativeElement.offsetWidth;
    const tHeight = this.toggle.nativeElement.offsetHeight;

    let xTrans = 0,
      yTrans = 0;
    let bWidth = tWidth,
      bHeight = tHeight;

    for (let i = 0; i < this.btnArray.length; i++) {
      bHeight = this.btnArray[i].nativeElement.offsetHeight;
      bWidth = this.btnArray[i].nativeElement.offsetWidth;

      xTrans += bWidth + 10;
      yTrans += bHeight + 10;

      var style = this.btnArray[i].nativeElement.style;

      style["visibility"] = "visible";
      style["transition-duration"] = `${90 + 100 * (i + 1)}ms`;
      style["transform"] = this.getTranslate(
        xTrans,
        yTrans,
        tWidth,
        tHeight,
        bWidth,
        bHeight
      );
    }
  }

  private updateButtons() {
    if (this.active) {
      this.doTranslation();
    } else {
      this.undoTranslation();
    }
  }

  @HostListener("document:click", ["$event.target"])
  public onDocumentClick(target: any): void {
    if (this.active && !this.element.nativeElement.contains(target)) {
      this.active = false;
      this.updateButtons();
    }
  }
}
