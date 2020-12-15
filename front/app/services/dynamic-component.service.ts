import { Injectable, Type, ComponentFactoryResolver, ViewContainerRef, ComponentFactory, ComponentRef } from '@angular/core';
import { IDynamicComponent, DynamicComponent } from './dynamic-component.class';

@Injectable()
export class DynamicComponentService {
    constructor(private componentResolver: ComponentFactoryResolver) {}

    private componentFactory: ComponentFactory<DynamicComponent>;

    public createDialog(
        viewContainer: ViewContainerRef,
        componentToLoad: Type<IDynamicComponent>,
        data: unknown = null,
    ): ComponentRef<DynamicComponent> {
        // if (viewContainer === undefined) {
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-param-reassign
        //   viewContainer = new ViewContainerRef();
        // }
        viewContainer.clear();

        this.componentFactory = this.componentResolver.resolveComponentFactory(componentToLoad);

        const item: ComponentRef<DynamicComponent> = viewContainer.createComponent(this.componentFactory, 0);

        item.instance.data = data;

        item.instance.close.subscribe(() => setTimeout(() => item.destroy(), 1));

        return item;
    }
}
