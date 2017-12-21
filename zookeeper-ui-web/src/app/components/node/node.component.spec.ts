import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterLinkStubDirective } from '../../testing/router-stubs';

import { NodeComponent } from './node.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { Node } from '../../model/Node';
import { NodeDataType } from '../../autogenerated/model/NodeDataType';
import { NodeData } from '../../autogenerated/model/NodeData';

import { ConfigApi } from '../../autogenerated/api/ConfigApi';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { Observable } from 'rxjs';

describe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;
  let configApi: ConfigApi;

  let configApiStub = {
    getNodeData: function(nodePath: string) {
      return Observable.of({ data: 'test value' });
    },
    getNodeDataType: function(nodePath: string) {
      return Observable.of(NodeDataType.String);
    },
    setNodeDataType: function(nodePath: string, nodeDataType: NodeDataType) {},
    setNodeData: function(nodePath: string, value: NodeData) {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule.forRoot()
      ],
      declarations: [
        NodeComponent,
        AlertsComponent,
        RouterLinkStubDirective
      ],
      providers: [
        { provide: ConfigApi, useValue: configApiStub },
        BsModalService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 5;
    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
    component.node = new Node('/test/path/nodeName');
    configApi = fixture.debugElement.injector.get(ConfigApi);
  });

  it('should navigate to node when clicked on the node name', () => {
    fixture.detectChanges();

    let nodeNameLink = fixture.debugElement.query(By.directive(RouterLinkStubDirective));
    let routerLink = nodeNameLink.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective;
    nodeNameLink.triggerEventHandler('click', null);

    expect(routerLink.linkParams).toBe('/nodes/test/path/nodeName');
  });

  it('should set show the znode passed in as an input with the retrieved value and data type', () => {
    fixture.detectChanges();

    // Change not detected on time. Need to investigate.
    //expect(fixture.debugElement.query(By.css('.node-value-selector')).nativeElement.textContent).toBe('test value');
    expect(fixture.debugElement.query(By.css('.node-name-selector')).nativeElement.textContent).toContain('nodeName');
    expect(fixture.debugElement.query(By.css('.node-name-selector')).nativeElement.textContent).toContain('0');
    expect(fixture.debugElement.query(By.css('.dropdown-toggle')).nativeElement.textContent).toContain('String');
  });

  it('should set the node value, node type and value the inputs when loaded from the configuration API', () => {
    fixture.detectChanges();
    expect(component.node.value).toBe('test value');
    expect(component.node.type).toBe('String');
    expect(component._editedValue).toBe('test value');
  });

  it('should set the node data type in the config api when a data type is selected in the dropdown', () => {
    fixture.detectChanges();

    let spy = spyOn(configApi, 'setNodeDataType');

    let numberDropDownEntry = fixture.debugElement.query(By.css('.Number-selector'));
    numberDropDownEntry.triggerEventHandler('click', null);

    expect(configApi.setNodeDataType).toHaveBeenCalledWith('/test/path/nodeName', NodeDataType.Number);
  });

  it('should start edition mode when clicking on the value input', () => {
    fixture.detectChanges();

    expect(component.editing).toBeFalsy();

    let inputsContainer = fixture.debugElement.query(By.css('.inputs-container-selector'));
    inputsContainer.triggerEventHandler('mousedown', null);

    expect(component.editing).toBeTruthy();
  });

  it('should stop edition mode when clicking on the cancel edition button', () => {
    fixture.detectChanges();

    let inputsContainer = fixture.debugElement.query(By.css('.inputs-container-selector'));
    inputsContainer.triggerEventHandler('mousedown', null);

    fixture.detectChanges();

    fixture.debugElement.query(By.css('.cancel-edition-selector')).triggerEventHandler('click', null);

    expect(component.editing).toBeFalsy();
  });

  it('should save node data when clicking on the save button', () => {
    fixture.detectChanges();

    let spy = spyOn(configApi, 'setNodeData');

    let inputsContainer = fixture.debugElement.query(By.css('.inputs-container-selector'));
    inputsContainer.triggerEventHandler('mousedown', null);

    fixture.detectChanges();

    fixture.debugElement.query(By.css('.save-edition-selector')).triggerEventHandler('click', null);

    expect(configApi.setNodeData).toHaveBeenCalledWith('/test/path/nodeName', { data: 'test value' });
  });

});
