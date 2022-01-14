import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { FabSpeedDialModule } from "./fab-speed-dial/fab-speed-dial.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FabSpeedDialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
