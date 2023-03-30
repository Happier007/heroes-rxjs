import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, Input } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Directive({
  selector: '[appSpinner]',
  standalone: true,
})
export class SpinnerDirective {
  @Input() set appSpinner(isShow: boolean) {
    isShow ? this.showLoader() : this.hideLoader();
  }

  overlayRef = this.overlay.create({
    scrollStrategy: this.overlay.scrollStrategies.reposition(),
    positionStrategy: this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPush(false)
      .withPositions([
        {
          originX: 'center',
          originY: 'center',
          overlayX: 'center',
          overlayY: 'center',
        },
      ]),
  });

  constructor(private elementRef: ElementRef, private overlay: Overlay) {}

  private showLoader() {
    console.log('www');
    this.overlayRef.attach(new ComponentPortal(SpinnerComponent));
  }

  private hideLoader() {
    this.overlayRef.detach();
  }
}
