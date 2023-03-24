import {inject, Injectable} from '@angular/core';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

import {LoaderComponent} from '../loader/loader.component';

@Injectable()
export class LoaderService {
  overlay = inject(Overlay);

  overlayRef = this.overlay.create({
    positionStrategy: this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically(),
    hasBackdrop: false,
  })

  showLoader() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent))
  }

  hideLoader() {
    this.overlayRef.detach()
  }
}
