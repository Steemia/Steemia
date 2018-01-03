import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostRenderComponent } from './post-render/post-render';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from "ionic-angular"

@NgModule({
	declarations: [PostRenderComponent],
	imports: [IonicModule, CommonModule, MomentModule],
	exports: [PostRenderComponent],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}
