import { NgModule } from '@angular/core';
import { FabToggleDirective, FabButtonDirective, FabSpeedDialComponent } from './fab-speed-dial.component';

@NgModule({
  imports: [],
  declarations: [FabToggleDirective, FabButtonDirective, FabSpeedDialComponent],
  exports: [FabToggleDirective, FabButtonDirective, FabSpeedDialComponent],
})
export class FabSpeedDialModule {}
